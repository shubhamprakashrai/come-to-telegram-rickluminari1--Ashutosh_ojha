import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'screens/dashboard_screen.dart';
import 'screens/login_screen.dart';
import 'firebase_options.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

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
      title: 'Ashutosh Law Admin',
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

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  Future<bool> _checkAdminStatus(String email) async {
    try {
      final response = await http.post(
        Uri.parse('https://ashutosh-api.toonshala.com/api/admins/verify'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email}),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['authorized'] == true;
      }
      return false;
    } catch (e) {
      debugPrint('Error verifying admin: $e');
      return false;
    }
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
          return FutureBuilder<bool>(
            future: _checkAdminStatus(email),
            builder: (context, authSnapshot) {
              if (authSnapshot.connectionState == ConnectionState.waiting) {
                return const Scaffold(
                  body: Center(child: CircularProgressIndicator(color: Color(0xFFD97706))),
                );
              }

              if (authSnapshot.data == true) {
                return const DashboardScreen();
              }

              // Not authorized — sign out and show access denied
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
        return const LoginScreen();
      },
    );
  }
}

