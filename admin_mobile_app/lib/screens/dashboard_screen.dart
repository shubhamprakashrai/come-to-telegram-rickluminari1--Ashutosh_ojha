import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'leads_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String? _fcmToken;
  static const String _apiBase = 'https://ashutosh-api.toonshala.com';
  int _totalLeads = 0;
  int _todayLeads = 0;
  int _weekLeads = 0;

  @override
  void initState() {
    super.initState();
    _initFCM();
    _fetchDashboard();
  }

  Future<void> _fetchDashboard() async {
    try {
      final resp = await http.get(Uri.parse('$_apiBase/api/dashboard'));
      if (resp.statusCode == 200) {
        final data = json.decode(resp.body);
        setState(() {
          _totalLeads = data['total_leads'] ?? 0;
          _todayLeads = data['today_leads'] ?? 0;
          _weekLeads = data['week_leads'] ?? 0;
        });
      }
    } catch (e) {
      debugPrint('Failed to fetch dashboard: $e');
    }
  }

  Future<void> _initFCM() async {
    NotificationSettings settings = await FirebaseMessaging.instance.requestPermission(
      alert: true, badge: true, sound: true,
    );
    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      final token = await FirebaseMessaging.instance.getToken();
      setState(() => _fcmToken = token);
      debugPrint('FCM Token: $token');
      // Register token with backend
      if (token != null) {
        try {
          await http.post(
            Uri.parse('$_apiBase/api/register-token'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({'token': token}),
          );
          debugPrint('FCM token registered with backend');
        } catch (e) {
          debugPrint('Failed to register FCM token: $e');
        }
      }
    }

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      if (!mounted) return;
      final notification = message.notification;
      if (notification != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFF1E293B),
            content: ListTile(
              leading: const Icon(Icons.notifications_active, color: Color(0xFFD97706)),
              title: Text(notification.title ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              subtitle: Text(notification.body ?? '', style: const TextStyle(color: Colors.grey)),
              contentPadding: EdgeInsets.zero,
            ),
            action: SnackBarAction(
              label: 'VIEW',
              textColor: const Color(0xFFD97706),
              onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const LeadsScreen())),
            ),
          ),
        );
      }
    });
  }

  Future<void> _signOut() async {
    await GoogleSignIn().signOut();
    await FirebaseAuth.instance.signOut();
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                child: Row(
                  children: [
                    Container(
                      width: 46,
                      height: 46,
                      decoration: BoxDecoration(
                        color: const Color(0xFFD97706).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFD97706).withOpacity(0.3)),
                      ),
                      child: const Icon(Icons.gavel_rounded, color: Color(0xFFD97706), size: 24),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Good day,',
                            style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.5)),
                          ),
                          Text(
                            user?.displayName?.split(' ').first ?? 'Admin',
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: _signOut,
                      icon: Icon(Icons.logout_rounded, color: Colors.white.withOpacity(0.5)),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Stats row
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  children: [
                    _StatCard(label: 'Today', value: '$_todayLeads', icon: Icons.person_add_alt_1),
                    const SizedBox(width: 12),
                    _StatCard(label: 'This Week', value: '$_weekLeads', icon: Icons.calendar_today_rounded),
                    const SizedBox(width: 12),
                    _StatCard(label: 'Total', value: '$_totalLeads', icon: Icons.people_alt_rounded),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Menu items
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Quick Actions',
                        style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.5), fontWeight: FontWeight.w600, letterSpacing: 1),
                      ),
                      const SizedBox(height: 16),
                      _MenuCard(
                        title: 'New Leads',
                        subtitle: 'View contact form submissions',
                        icon: Icons.inbox_rounded,
                        badge: true,
                        onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const LeadsScreen())),
                      ),
                      const SizedBox(height: 12),
                      _MenuCard(
                        title: 'Blog Manager',
                        subtitle: 'Create and manage articles',
                        icon: Icons.article_rounded,
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Blog Manager coming soon!')),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),

              // FCM debug token
              if (_fcmToken != null)
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.notifications_active_outlined, color: Color(0xFFD97706), size: 16),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'FCM: ${_fcmToken!.substring(0, 20)}...',
                            style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.4)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _StatCard({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: const Color(0xFFD97706), size: 24),
            const SizedBox(height: 12),
            Text(value, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.5))),
          ],
        ),
      ),
    );
  }
}

class _MenuCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;
  final bool badge;

  const _MenuCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onTap,
    this.badge = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: const Color(0xFFD97706).withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: const Color(0xFFD97706), size: 26),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                      if (badge) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text('NEW', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                      ]
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(subtitle, style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.5))),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.white.withOpacity(0.3)),
          ],
        ),
      ),
    );
  }
}
