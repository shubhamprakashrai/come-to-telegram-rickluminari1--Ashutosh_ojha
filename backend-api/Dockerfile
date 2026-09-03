FROM rust:latest AS builder

WORKDIR /usr/src/app
COPY . .

# Install required build dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev

RUN cargo build --release

FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /usr/src/app/target/release/backend-api /app/backend-api
COPY --from=builder /usr/src/app/.env /app/.env

EXPOSE 8080

CMD ["./backend-api"]
