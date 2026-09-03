import 'dart:convert';
import 'package:cryptography/cryptography.dart';
import 'package:http/http.dart' as http;

/// Decrypts the AES-256-GCM envelopes ({ iv, data }, both base64) returned
/// by the backend for admin endpoints. The key is derived (SHA-256) from a
/// secret shared with the backend and the web admin console — see
/// backend-api/src/crypto.rs and src/lib/apiCrypto.ts for the matching
/// implementations.
class ApiCrypto {
  static const String _sharedSecret = 'AshutoshLaw#Secure2026\$VPS-Encryption-Key';
  static SecretKey? _cachedKey;

  static Future<SecretKey> _getKey() async {
    if (_cachedKey != null) return _cachedKey!;
    final hash = await Sha256().hash(utf8.encode(_sharedSecret));
    _cachedKey = SecretKey(hash.bytes);
    return _cachedKey!;
  }

  static Future<dynamic> decryptEnvelope(Map<String, dynamic> envelope) async {
    final algorithm = AesGcm.with256bits();
    final key = await _getKey();

    final ivBytes = base64.decode(envelope['iv'] as String);
    final full = base64.decode(envelope['data'] as String);
    // AES-GCM tag is the last 16 bytes, appended by the encrypting side.
    final cipherBytes = full.sublist(0, full.length - 16);
    final macBytes = full.sublist(full.length - 16);

    final secretBox = SecretBox(cipherBytes, nonce: ivBytes, mac: Mac(macBytes));
    final clearBytes = await algorithm.decrypt(secretBox, secretKey: key);
    return json.decode(utf8.decode(clearBytes));
  }
}

class ApiCryptoException implements Exception {
  final String message;
  ApiCryptoException(this.message);
  @override
  String toString() => message;
}

/// Thin http helper: GET/POST/DELETE an admin endpoint and decrypt the
/// response body. Any failure here (network, non-200, bad decrypt) throws —
/// callers must treat that as "couldn't reach the server", not "unauthorized".
class ApiClient {
  static Future<dynamic> get(String url) async {
    final res = await http.get(Uri.parse(url));
    if (res.statusCode != 200) {
      throw ApiCryptoException('Server error (${res.statusCode})');
    }
    return ApiCrypto.decryptEnvelope(json.decode(res.body) as Map<String, dynamic>);
  }

  static Future<dynamic> post(String url, Map<String, dynamic> body) async {
    final res = await http.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(body),
    );
    if (res.statusCode != 200) {
      throw ApiCryptoException('Server error (${res.statusCode})');
    }
    return ApiCrypto.decryptEnvelope(json.decode(res.body) as Map<String, dynamic>);
  }

  static Future<dynamic> delete(String url) async {
    final res = await http.delete(Uri.parse(url));
    if (res.statusCode != 200) {
      throw ApiCryptoException('Server error (${res.statusCode})');
    }
    return ApiCrypto.decryptEnvelope(json.decode(res.body) as Map<String, dynamic>);
  }
}
