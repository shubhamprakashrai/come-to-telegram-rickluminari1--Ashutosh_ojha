use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Key, Nonce,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use rand::RngCore;
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::env;

/// Shared secret used to derive the AES-256 key on both the backend and the
/// clients (web + mobile). Overridable via DATA_ENC_KEY so it isn't baked
/// only into source control, but defaults to this value so a fresh deploy
/// never mismatches what's already compiled into the clients.
const DEFAULT_SHARED_SECRET: &str = "AshutoshLaw#Secure2026$VPS-Encryption-Key";

fn derive_key() -> [u8; 32] {
    let secret = env::var("DATA_ENC_KEY").unwrap_or_else(|_| DEFAULT_SHARED_SECRET.to_string());
    let mut hasher = Sha256::new();
    hasher.update(secret.as_bytes());
    hasher.finalize().into()
}

/// Encrypts a JSON value with AES-256-GCM and returns an envelope of
/// `{ "iv": base64, "data": base64 }`. The GCM authentication tag means any
/// tampering with the ciphertext (in transit or in devtools) makes
/// decryption fail on the client instead of silently changing the data.
pub fn encrypt_response(value: &Value) -> Value {
    let key_bytes = derive_key();
    let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);

    let mut nonce_bytes = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let plaintext = serde_json::to_vec(value).expect("value is always valid JSON");
    let ciphertext = cipher
        .encrypt(nonce, plaintext.as_ref())
        .expect("AES-GCM encryption cannot fail for well-formed input");

    json!({
        "iv": STANDARD.encode(nonce_bytes),
        "data": STANDARD.encode(ciphertext),
    })
}
