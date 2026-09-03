use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct ContactFormRequest {
    pub name: String,
    pub email: String,
    pub phone: String,
    pub query_type: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Lead {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub query_type: String,
    pub message: String,
    pub created_at: DateTime<Utc>,
}
