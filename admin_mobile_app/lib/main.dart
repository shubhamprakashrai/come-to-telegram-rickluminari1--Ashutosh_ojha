import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'screens/dashboard_screen.dart';
import 'screens/login_screen.dart';
import 'firebase_options.dart';
import 'services/api_crypto.dart';

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

const AndroidNotificationChannel channel = AndroidNotificationChannel(
  'high_importance_channel',
  'High Importance Notifications',
  description: 'This channel is used for new lead notifications.',
  importance: Importance.high,
);

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  await flutterLocalNotificationsPlugin
      .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>()
      ?.createNotificationChannel(channel);

  await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
    alert: true,
    badge: true,
    sound: true,
  );

  runApp(const AdminApp());
}

class AdminApp extends StatelessWidget {
  const AdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ashutosh Law',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFD97706),
          surface: Color(0xFF0F172A),
        ),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
      ),
      home: const AuthGate(),
    );
  }
}

/// Tri-state result of checking admin status against the backend.
/// Kept distinct from a plain bool so a network/server failure never gets
/// collapsed into "unauthorized" — that was the bug that signed real admins
/// out (and bounced them back to the login screen) whenever the API blipped.
enum _AdminCheck { authorized, unauthorized, checkFailed }

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  Future<_AdminCheck>? _checkFuture;
  String? _checkedEmail;

  Future<_AdminCheck> _checkAdminStatus(String email) async {
    try {
      final data = await ApiClient.post(
        'https://ashutosh-api.toonshala.com/api/admins/verify',
        {'email': email},
      );
      return data['authorized'] == true ? _AdminCheck.authorized : _AdminCheck.unauthorized;
    } catch (e) {
      debugPrint('Error verifying admin: $e');
      return _AdminCheck.checkFailed;
    }
  }

  void _startCheck(String email) {
    _checkedEmail = email;
    _checkFuture = _checkAdminStatus(email);
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator(color: Color(0xFFD97706))),
          );
        }
        if (snapshot.hasData) {
          final email = snapshot.data?.email ?? '';
          if (_checkFuture == null || _checkedEmail != email) {
            _startCheck(email);
          }
          return FutureBuilder<_AdminCheck>(
            future: _checkFuture,
            builder: (context, authSnapshot) {
              if (authSnapshot.connectionState == ConnectionState.waiting) {
                return const Scaffold(
                  body: Center(child: CircularProgressIndicator(color: Color(0xFFD97706))),
                );
              }

              if (authSnapshot.data == _AdminCheck.authorized) {
                return const DashboardScreen();
              }

              if (authSnapshot.data == _AdminCheck.checkFailed) {
                // Server unreachable — stay signed in and let the admin retry.
                // Signing out here is exactly what caused the repeated
                // "kicked back to login" loop whenever the API was down.
                return Scaffold(
                  backgroundColor: const Color(0xFF0F172A),
                  body: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.wifi_off_rounded, size: 64, color: Color(0xFFD97706)),
                          const SizedBox(height: 20),
                          const Text('Can\'t Reach Server', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          Text(
                            'You\'re still signed in as $email.\nCheck your connection and retry.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white.withOpacity(0.5)),
                          ),
                          const SizedBox(height: 24),
                          ElevatedButton(
                            onPressed: () => setState(() => _startCheck(email)),
                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFD97706)),
                            child: const Text('Retry', style: TextStyle(color: Colors.white)),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }

              // Explicitly not authorized in the admin_users table — sign out.
              FirebaseAuth.instance.signOut();
              return Scaffold(
                backgroundColor: const Color(0xFF0F172A),
                body: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.block_rounded, size: 64, color: Colors.redAccent),
                      const SizedBox(height: 20),
                      const Text('Access Denied', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(
                        '$email\nis not registered in admin database.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.white.withOpacity(0.5)),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFD97706)),
                        child: const Text('Back to Login', style: TextStyle(color: Colors.white)),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        }
        _checkFuture = null;
        _checkedEmail = null;
        return const LoginScreen();
      },
    );
  }
}

