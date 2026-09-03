mod db;
mod fcm;
mod models;

use axum::{
    extract::{Path, State},
    routing::{delete, get, post},
    Router,
    Json,
    http::StatusCode,
};
use serde_json::{Value, json};
use tower_http::cors::{Any, CorsLayer};
use std::net::SocketAddr;
use tracing::{info, error};
use sqlx::PgPool;
use models::{ContactFormRequest, Lead, RegisterTokenRequest, AdminUser, AddAdminRequest, VerifyAdminRequest};

#[derive(Clone)]
struct AppState {
    db: PgPool,
}

#[tokio::main]
async fn main() {
    // Load env variables if .env file exists (local dev)
    let _ = dotenvy::dotenv();
    tracing_subscriber::fmt::init();

    let db_pool = db::init_db().await.expect("Failed to initialize database");
    let state = AppState { db: db_pool };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/contact", post(submit_contact_form))
        .route("/api/leads", get(get_leads))
        .route("/api/dashboard", get(get_dashboard))
        .route("/api/register-token", post(register_token))
        .route("/api/admins", get(get_admins))
        .route("/api/admins/verify", post(verify_admin))
        .route("/api/admins", post(add_admin))
        .route("/api/admins/:id", delete(delete_admin))
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    info!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

async fn submit_contact_form(
    State(state): State<AppState>,
    Json(payload): Json<ContactFormRequest>,
) -> Result<Json<Value>, (StatusCode, String)> {
    let lead_id = uuid::Uuid::new_v4();
    let created_at = chrono::Utc::now();

    let result = sqlx::query(
        r#"
        INSERT INTO leads (id, name, email, phone, query_type, message, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        "#,
    )
    .bind(lead_id)
    .bind(&payload.name)
    .bind(&payload.email)
    .bind(&payload.phone)
    .bind(&payload.query_type)
    .bind(&payload.message)
    .bind(created_at)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => {
            info!("Successfully inserted lead: {}", lead_id);
            // Trigger FCM Push Notification
            fcm::send_push_notification(&payload.name, &payload.query_type, &payload.message, &state.db).await;
            
            Ok(Json(json!({ "status": "success", "message": "Contact form submitted", "lead_id": lead_id })))
        }
        Err(e) => {
            error!("Failed to insert lead: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string()))
        }
    }
}

async fn get_leads(
    State(state): State<AppState>,
) -> Result<Json<Value>, (StatusCode, String)> {
    let rows = sqlx::query_as::<_, Lead>(
        "SELECT id, name, email, phone, query_type, message, created_at FROM leads ORDER BY created_at DESC"
    )
    .fetch_all(&state.db)
    .await;

    match rows {
        Ok(leads) => Ok(Json(json!(leads))),
        Err(e) => {
            error!("Failed to fetch leads: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string()))
        }
    }
}

async fn register_token(
    State(state): State<AppState>,
    Json(payload): Json<RegisterTokenRequest>,
) -> Result<Json<Value>, (StatusCode, String)> {
    let result = sqlx::query(
        "INSERT INTO device_tokens (token) VALUES ($1) ON CONFLICT (token) DO NOTHING"
    )
    .bind(&payload.token)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => {
            info!("Registered FCM token: {}...", &payload.token[..20.min(payload.token.len())]);
            Ok(Json(json!({ "status": "success" })))
        }
        Err(e) => {
            error!("Failed to register token: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string()))
        }
    }
}

async fn get_dashboard(
    State(state): State<AppState>,
) -> Result<Json<Value>, (StatusCode, String)> {
    let total: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM leads")
        .fetch_one(&state.db)
        .await
        .map_err(|e| { error!("Dashboard query failed: {}", e); (StatusCode::INTERNAL_SERVER_ERROR, "DB error".to_string()) })?;

    let today: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM leads WHERE created_at >= CURRENT_DATE")
        .fetch_one(&state.db)
        .await
        .map_err(|e| { error!("Dashboard query failed: {}", e); (StatusCode::INTERNAL_SERVER_ERROR, "DB error".to_string()) })?;

    let this_week: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM leads WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'")
        .fetch_one(&state.db)
        .await
        .map_err(|e| { error!("Dashboard query failed: {}", e); (StatusCode::INTERNAL_SERVER_ERROR, "DB error".to_string()) })?;

    Ok(Json(json!({
        "total_leads": total.0,
        "today_leads": today.0,
        "week_leads": this_week.0
    })))
}

async fn get_admins(
    State(state): State<AppState>,
) -> Result<Json<Value>, (StatusCode, String)> {
    let rows = sqlx::query_as::<_, AdminUser>(
        "SELECT id, email, role, created_at FROM admin_users ORDER BY created_at ASC"
    )
    .fetch_all(&state.db)
    .await;

    match rows {
        Ok(admins) => Ok(Json(json!(admins))),
        Err(e) => {
            error!("Failed to fetch admins: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string()))
        }
    }
}

async fn verify_admin(
    State(state): State<AppState>,
    Json(payload): Json<VerifyAdminRequest>,
) -> Result<Json<Value>, (StatusCode, String)> {
    let normalized_email = payload.email.trim().to_lowercase();
    let row = sqlx::query_as::<_, AdminUser>(
        "SELECT id, email, role, created_at FROM admin_users WHERE LOWER(email) = $1"
    )
    .bind(normalized_email)
    .fetch_optional(&state.db)
    .await;

    match row {
        Ok(Some(admin)) => Ok(Json(json!({
            "authorized": true,
            "role": admin.role,
            "email": admin.email
        }))),
        Ok(None) => Ok(Json(json!({
            "authorized": false,
            "message": "User not authorized"
        }))),
        Err(e) => {
            error!("Error verifying admin: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string()))
        }
    }
}

async fn add_admin(
    State(state): State<AppState>,
    Json(payload): Json<AddAdminRequest>,
) -> Result<Json<Value>, (StatusCode, String)> {
    let email = payload.email.trim().to_lowercase();
    let role = payload.role.unwrap_or_else(|| "admin".to_string());

    let result = sqlx::query(
        "INSERT INTO admin_users (email, role) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET role = $2"
    )
    .bind(&email)
    .bind(&role)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => {
            info!("Successfully added/updated admin: {}", email);
            Ok(Json(json!({ "status": "success", "message": "Admin added successfully" })))
        }
        Err(e) => {
            error!("Failed to add admin: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string()))
        }
    }
}

async fn delete_admin(
    State(state): State<AppState>,
    Path(id): Path<uuid::Uuid>,
) -> Result<Json<Value>, (StatusCode, String)> {
    let result = sqlx::query("DELETE FROM admin_users WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await;

    match result {
        Ok(_) => {
            info!("Deleted admin: {}", id);
            Ok(Json(json!({ "status": "success", "message": "Admin removed" })))
        }
        Err(e) => {
            error!("Failed to delete admin: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string()))
        }
    }
}
