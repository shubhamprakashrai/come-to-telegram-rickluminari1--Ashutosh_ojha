mod db;
mod fcm;
mod models;

use axum::{
    extract::State,
    routing::{get, post},
    Router,
    Json,
    http::StatusCode,
};
use serde_json::{Value, json};
use tower_http::cors::{Any, CorsLayer};
use std::net::SocketAddr;
use tracing::{info, error};
use sqlx::PgPool;
use models::{ContactFormRequest, Lead};

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
            fcm::send_push_notification(&payload.name, &payload.query_type, &payload.message).await;
            
            Ok(Json(json!({ "status": "success", "message": "Contact form submitted", "lead_id": lead_id })))
        }
        Err(e) => {
            error!("Failed to insert lead: {}", e);
            Err((StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string()))
        }
    }
}
