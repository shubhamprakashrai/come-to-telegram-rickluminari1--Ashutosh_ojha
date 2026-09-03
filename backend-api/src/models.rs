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

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterTokenRequest {
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct AdminUser {
    pub id: Uuid,
    pub email: String,
    pub role: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AddAdminRequest {
    pub email: String,
    pub role: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VerifyAdminRequest {
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct BlogPost {
    pub id: Uuid,
    pub title: String,
    pub slug: String,
    pub category: String,
    pub excerpt: String,
    pub content: String,
    pub author: String,
    pub image_url: Option<String>,
    pub published: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateBlogRequest {
    pub title: String,
    pub category: String,
    pub excerpt: String,
    pub content: String,
    pub author: Option<String>,
    pub image_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct PracticeCategory {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCategoryRequest {
    pub name: String,
    pub description: Option<String>,
}
