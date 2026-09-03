import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'leads_screen.dart';
import 'admin_management_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with SingleTickerProviderStateMixin {
  String? _fcmToken;
  static const String _apiBase = 'https://ashutosh-api.toonshala.com';
  int _totalLeads = 0;
  int _todayLeads = 0;
  int _weekLeads = 0;
  late AnimationController _animController;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..forward();
    _initFCM();
    _fetchDashboard();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
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
        _fetchDashboard(); // Refresh stats on new notification
        showModalBottomSheet(
          context: context,
          backgroundColor: Colors.transparent,
          builder: (ctx) => Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1A2035), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFD97706).withOpacity(0.3)),
              boxShadow: [
                BoxShadow(color: const Color(0xFFD97706).withOpacity(0.1), blurRadius: 30),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: [const Color(0xFFD97706).withOpacity(0.2), const Color(0xFFF59E0B).withOpacity(0.05)]),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: const Icon(Icons.notifications_active_rounded, color: Color(0xFFD97706), size: 28),
                ),
                const SizedBox(height: 16),
                Text(notification.title ?? 'New Lead!', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                const SizedBox(height: 8),
                Text(notification.body ?? '', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 14), textAlign: TextAlign.center),
                const SizedBox(height: 20),
                GestureDetector(
                  onTap: () { Navigator.pop(ctx); Navigator.push(context, MaterialPageRoute(builder: (_) => const LeadsScreen())); },
                  child: Container(
                    width: double.infinity, height: 48,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFFD97706), Color(0xFFF59E0B)]),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Center(child: Text('View Lead', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15))),
                  ),
                ),
              ],
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
    final hour = DateTime.now().hour;
    String greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0A0F1E), Color(0xFF0F172A), Color(0xFF1A1F35)],
          ),
        ),
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: _fetchDashboard,
            color: const Color(0xFFD97706),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: FadeTransition(
                  opacity: _animController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      Row(
                        children: [
                          Container(
                            width: 50, height: 50,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [const Color(0xFFD97706).withOpacity(0.2), const Color(0xFFF59E0B).withOpacity(0.05)],
                              ),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFFD97706).withOpacity(0.3)),
                            ),
                            child: const Icon(Icons.gavel_rounded, color: Color(0xFFD97706), size: 26),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(greeting, style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.4), fontWeight: FontWeight.w500)),
                                const SizedBox(height: 2),
                                Text(
                                  user?.displayName?.split(' ').first ?? 'Admin',
                                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: -0.5),
                                ),
                              ],
                            ),
                          ),
                          GestureDetector(
                            onTap: _signOut,
                            child: Container(
                              width: 42, height: 42,
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.05),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: Colors.white.withOpacity(0.08)),
                              ),
                              child: Icon(Icons.logout_rounded, color: Colors.white.withOpacity(0.4), size: 20),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 32),

                      // Hero stat card
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(28),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [Color(0xFFD97706), Color(0xFFF59E0B), Color(0xFFD97706)],
                          ),
                          borderRadius: BorderRadius.circular(28),
                          boxShadow: [
                            BoxShadow(color: const Color(0xFFD97706).withOpacity(0.3), blurRadius: 30, offset: const Offset(0, 12)),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Total Leads', style: TextStyle(fontSize: 14, color: Colors.white70, fontWeight: FontWeight.w600)),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: const Text('All Time', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              '$_totalLeads',
                              style: const TextStyle(fontSize: 52, fontWeight: FontWeight.w900, color: Colors.white, height: 1, letterSpacing: -2),
                            ),
                            const SizedBox(height: 4),
                            Text('enquiries received', style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.7))),
                          ],
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Mini stat cards
                      Row(
                        children: [
                          Expanded(child: _MiniStatCard(label: 'Today', value: '$_todayLeads', icon: Icons.today_rounded, color: const Color(0xFF10B981))),
                          const SizedBox(width: 14),
                          Expanded(child: _MiniStatCard(label: 'This Week', value: '$_weekLeads', icon: Icons.date_range_rounded, color: const Color(0xFF6366F1))),
                        ],
                      ),

                      const SizedBox(height: 32),

                      // Quick Actions
                      Text('QUICK ACTIONS', style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.3), fontWeight: FontWeight.w700, letterSpacing: 2)),
                      const SizedBox(height: 16),

                      _ActionCard(
                        title: 'View Leads',
                        subtitle: 'All contact form submissions',
                        icon: Icons.inbox_rounded,
                        gradient: [const Color(0xFFD97706).withOpacity(0.15), const Color(0xFFF59E0B).withOpacity(0.05)],
                        iconColor: const Color(0xFFD97706),
                        badge: _todayLeads > 0 ? '$_todayLeads new' : null,
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LeadsScreen())),
                      ),
                      const SizedBox(height: 12),
                      _ActionCard(
                        title: 'Manage Admins',
                        subtitle: 'Add or remove team access',
                        icon: Icons.admin_panel_settings_rounded,
                        gradient: [const Color(0xFF10B981).withOpacity(0.15), const Color(0xFF059669).withOpacity(0.05)],
                        iconColor: const Color(0xFF10B981),
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminManagementScreen())),
                      ),
                      const SizedBox(height: 12),
                      _ActionCard(
                        title: 'Blog Manager',
                        subtitle: 'Create and manage articles',
                        icon: Icons.article_rounded,
                        gradient: [const Color(0xFF6366F1).withOpacity(0.15), const Color(0xFF8B5CF6).withOpacity(0.05)],
                        iconColor: const Color(0xFF6366F1),
                        onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Blog Manager coming soon!'), backgroundColor: Color(0xFF1E293B)),
                        ),
                      ),
                      const SizedBox(height: 12),
                      _ActionCard(
                        title: 'Website',
                        subtitle: 'Open ashutosh-ojha-18afc.web.app',
                        icon: Icons.language_rounded,
                        gradient: [const Color(0xFF10B981).withOpacity(0.15), const Color(0xFF34D399).withOpacity(0.05)],
                        iconColor: const Color(0xFF10B981),
                        onTap: () {},
                      ),

                      const SizedBox(height: 32),

                      // FCM status
                      if (_fcmToken != null)
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.03),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.06)),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 8, height: 8,
                                decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(4)),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Push notifications active',
                                  style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.35)),
                                ),
                              ),
                              Icon(Icons.notifications_active_outlined, size: 16, color: Colors.white.withOpacity(0.2)),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _MiniStatCard extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final Color color;

  const _MiniStatCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.04),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 16),
          Text(value, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white, height: 1, letterSpacing: -1)),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.4), fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final String title, subtitle;
  final IconData icon;
  final List<Color> gradient;
  final Color iconColor;
  final String? badge;
  final VoidCallback onTap;

  const _ActionCard({
    required this.title, required this.subtitle, required this.icon,
    required this.gradient, required this.iconColor, required this.onTap, this.badge,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.04),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: Colors.white.withOpacity(0.06)),
        ),
        child: Row(
          children: [
            Container(
              width: 52, height: 52,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: gradient),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: iconColor, size: 26),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
                      if (badge != null) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(colors: [Color(0xFFD97706), Color(0xFFF59E0B)]),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(badge!, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700)),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(subtitle, style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.4))),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.white.withOpacity(0.2)),
          ],
        ),
      ),
    );
  }
}
