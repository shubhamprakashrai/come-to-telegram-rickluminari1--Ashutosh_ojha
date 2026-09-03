#!/bin/bash
set -e

APP_DIR="/opt/ashutosh-law-api"
mkdir -p $APP_DIR
cd $APP_DIR

# Create docker-compose for PostgreSQL
cat << 'EOF' > docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ashutosh_admin
      POSTGRES_PASSWORD: secure_password_123
      POSTGRES_DB: law_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# Start database
docker compose up -d

# Source rust env if available
source $HOME/.cargo/env || true

# Initialize cargo project if not already present
if [ ! -f "Cargo.toml" ]; then
    cargo init --bin
    
    # Add dependencies
    cargo add axum
    cargo add tokio -F full
    cargo add serde -F derive
    cargo add serde_json
    cargo add sqlx -F runtime-tokio-rustls,postgres,uuid,chrono
    cargo add dotenvy
    cargo add tower-http -F cors,trace
    cargo add tracing
    cargo add tracing-subscriber
    cargo add jsonwebtoken
    cargo add uuid -F v4,serde
    cargo add chrono -F serde
    cargo add reqwest -F json
fi

echo "Backend setup complete in $APP_DIR"
