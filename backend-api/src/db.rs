use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;
use std::time::Duration;

pub async fn init_db() -> Result<PgPool, sqlx::Error> {
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .connect(&db_url)
        .await?;

    // Create the leads table if it doesn't exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS leads (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            query_type VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        "#,
    )
    .execute(&pool)
    .await?;

    // Create device_tokens table for FCM push notifications
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS device_tokens (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            token TEXT UNIQUE NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        "#,
    )
    .execute(&pool)
    .await?;

    // Create admin_users table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS admin_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'admin',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        "#,
    )
    .execute(&pool)
    .await?;

    sqlx::query(
        r#"
        INSERT INTO admin_users (email, role) 
        VALUES ('ashishraimsd@gmail.com', 'superadmin')
        ON CONFLICT (email) DO NOTHING;
        "#,
    )
    .execute(&pool)
    .await?;

    // Create blogs table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS blogs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            category VARCHAR(100) NOT NULL,
            excerpt TEXT NOT NULL,
            content TEXT NOT NULL,
            author VARCHAR(100) NOT NULL DEFAULT 'Ashutosh Ojha',
            image_url TEXT,
            published BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        "#,
    )
    .execute(&pool)
    .await?;

    // Ensure image_url column exists
    sqlx::query(
        r#"
        ALTER TABLE blogs ADD COLUMN IF NOT EXISTS image_url TEXT;
        "#,
    )
    .execute(&pool)
    .await?;


    Ok(pool)
}
