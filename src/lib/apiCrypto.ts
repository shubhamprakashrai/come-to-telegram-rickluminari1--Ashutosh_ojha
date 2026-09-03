/**
 * Decrypts AES-256-GCM envelopes returned by the backend ({ iv, data }, both
 * base64) and provides a fetch wrapper for admin API calls.
 *
 * The key is derived (SHA-256) from a secret shared with the backend and the
 * Flutter app. Because this runs in the browser, the secret ships inside the
 * JS bundle and isn't truly hidden from someone reading the code — but the
 * GCM auth tag still guarantees tamper-evidence: any modified ciphertext
 * fails to decrypt instead of silently applying a changed value.
 */
const SHARED_SECRET = 'AshutoshLaw#Secure2026$VPS-Encryption-Key';

let cachedKey: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  const secretBytes = new TextEncoder().encode(SHARED_SECRET);
  const hash = await crypto.subtle.digest('SHA-256', secretBytes);
  cachedKey = await crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['decrypt']);
  return cachedKey;
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function decryptEnvelope<T = unknown>(envelope: { iv: string; data: string }): Promise<T> {
  const key = await getKey();
  const iv = base64ToBytes(envelope.iv);
  const ciphertext = base64ToBytes(envelope.data);
  const plaintextBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ciphertext as BufferSource
  );
  const text = new TextDecoder().decode(plaintextBuf);
  return JSON.parse(text) as T;
}

/**
 * Fetches JSON from an admin API endpoint and decrypts it.
 * Throws on network failure or a failed decrypt (tampered/corrupt payload) —
 * callers should treat that as "couldn't reach the server", never as
 * "user is unauthorized".
 */
export async function fetchEncryptedJson<T = unknown>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  const envelope = await res.json();
  return decryptEnvelope<T>(envelope);
}
