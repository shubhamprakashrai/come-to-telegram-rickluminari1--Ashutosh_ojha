use serde::{Deserialize, Serialize};
use serde_json::json;
use tracing::{info, error};
use jsonwebtoken::{encode, EncodingKey, Header, Algorithm};
use std::time::{SystemTime, UNIX_EPOCH};
use reqwest::Client;

const FCM_SCOPE: &str = "https://www.googleapis.com/auth/firebase.messaging";
const TOKEN_URI: &str = "https://oauth2.googleapis.com/token";
const FCM_URL: &str = "https://fcm.googleapis.com/v1/projects/ashutosh-ojha-18afc/messages:send";

#[derive(Debug, Serialize, Deserialize)]
struct ServiceAccountKey {
    client_email: String,
    private_key: String,
    token_uri: String,
}

#[derive(Debug, Serialize)]
struct JwtClaims {
    iss: String,
    scope: String,
    aud: String,
    iat: u64,
    exp: u64,
}

#[derive(Debug, Deserialize)]
struct TokenResponse {
    access_token: String,
}

async fn get_access_token() -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    let candidate_paths = [
        std::env::var("GOOGLE_APPLICATION_CREDENTIALS").unwrap_or_default(),
        "/app/firebase-sa-key.json".to_string(),
        "./firebase-sa-key.json".to_string(),
        "firebase-sa-key.json".to_string(),
        "/opt/ashutosh-law-api-new/backend-api/firebase-sa-key.json".to_string(),
    ];

    let mut sa_content = None;
    for path in &candidate_paths {
        if !path.is_empty() {
            if let Ok(content) = std::fs::read_to_string(path) {
                sa_content = Some(content);
                break;
            }
        }
    }

    let sa_content = sa_content.ok_or("Could not find firebase-sa-key.json in any expected path")?;
    let sa_key: ServiceAccountKey = serde_json::from_str(&sa_content)?;


    let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs();
    let claims = JwtClaims {
        iss: sa_key.client_email,
        scope: FCM_SCOPE.to_string(),
        aud: TOKEN_URI.to_string(),
        iat: now,
        exp: now + 3600,
    };

    let mut header = Header::new(Algorithm::RS256);
    header.typ = Some("JWT".to_string());
    
    let key = EncodingKey::from_rsa_pem(sa_key.private_key.as_bytes())?;
    let jwt = encode(&header, &claims, &key)?;

    let client = Client::new();
    let resp = client
        .post(TOKEN_URI)
        .form(&[
            ("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer"),
            ("assertion", &jwt),
        ])
        .send()
        .await?;

    let token_resp: TokenResponse = resp.json().await?;
    Ok(token_resp.access_token)
}

pub async fn send_push_to_token(token: &str, name: &str, query_type: &str, message: &str) {
    let access_token = match get_access_token().await {
        Ok(t) => t,
        Err(e) => {
            error!("Failed to get FCM access token: {}", e);
            return;
        }
    };

    let fcm_payload = json!({
        "message": {
            "token": token,
            "notification": {
                "title": format!("📩 New Lead: {}", name),
                "body": format!("{} - {}", query_type, if message.len() > 100 { &message[..100] } else { message })
            },
            "data": {
                "type": "new_lead",
                "name": name,
                "query_type": query_type
            },
            "android": {
                "priority": "high",
                "notification": {
                    "channel_id": "high_importance_channel",
                    "sound": "default"
                }
            }
        }
    });

    let client = Client::new();
    let resp = client
        .post(FCM_URL)
        .bearer_auth(&access_token)
        .json(&fcm_payload)
        .send()
        .await;

    match resp {
        Ok(r) => {
            let status = r.status();
            let body = r.text().await.unwrap_or_default();
            if status.is_success() {
                info!("FCM push sent successfully to token: {}...", &token[..20]);
            } else {
                error!("FCM push failed ({}): {}", status, body);
            }
        }
        Err(e) => error!("FCM HTTP request failed: {}", e),
    }
}

pub async fn send_push_notification(name: &str, query_type: &str, message: &str, db: &sqlx::PgPool) {
    // Fetch all registered device tokens
    let tokens: Vec<(String,)> = match sqlx::query_as("SELECT token FROM device_tokens")
        .fetch_all(db)
        .await
    {
        Ok(t) => t,
        Err(e) => {
            error!("Failed to fetch device tokens: {}", e);
            return;
        }
    };

    if tokens.is_empty() {
        info!("No device tokens registered, skipping FCM push");
        return;
    }

    info!("Sending FCM push to {} device(s)", tokens.len());
    for (token,) in &tokens {
        send_push_to_token(token, name, query_type, message).await;
    }
}
