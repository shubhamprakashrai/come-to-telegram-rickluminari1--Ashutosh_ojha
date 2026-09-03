import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class AdminManagementScreen extends StatefulWidget {
  const AdminManagementScreen({super.key});

  @override
  State<AdminManagementScreen> createState() => _AdminManagementScreenState();
}

class _AdminManagementScreenState extends State<AdminManagementScreen> {
  static const String _apiBase = 'https://ashutosh-api.toonshala.com';
  List<dynamic> _admins = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchAdmins();
  }

  Future<void> _fetchAdmins() async {
    setState(() { _isLoading = true; _error = null; });
    try {
      final res = await http.get(Uri.parse('$_apiBase/api/admins'));
      if (res.statusCode == 200) {
        setState(() {
          _admins = json.decode(res.body);
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to load admins (${res.statusCode})';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Connection failed';
        _isLoading = false;
      });
    }
  }

  void _showAddAdminDialog() {
    final emailController = TextEditingController();
    String role = 'admin';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Add New Admin', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: emailController,
                keyboardType: TextInputType.emailAddress,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Enter Google email',
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
                  prefixIcon: const Icon(Icons.email_rounded, color: Color(0xFFD97706)),
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.05),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: role,
                dropdownColor: const Color(0xFF1E293B),
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.05),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
                items: const [
                  DropdownMenuItem(value: 'admin', child: Text('Admin (View & Manage Leads)')),
                  DropdownMenuItem(value: 'superadmin', child: Text('Super Admin (Full Control)')),
                ],
                onChanged: (val) {
                  if (val != null) setDialogState(() => role = val);
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Cancel', style: TextStyle(color: Colors.white.withOpacity(0.5))),
            ),
            ElevatedButton(
              onPressed: () async {
                final email = emailController.text.trim();
                if (email.isEmpty || !email.contains('@')) return;
                Navigator.pop(ctx);
                
                try {
                  final res = await http.post(
                    Uri.parse('$_apiBase/api/admins'),
                    headers: {'Content-Type': 'application/json'},
                    body: json.encode({'email': email, 'role': role}),
                  );
                  if (res.statusCode == 200) {
                    _fetchAdmins();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Admin $email added successfully!'), backgroundColor: const Color(0xFF10B981)),
                    );
                  }
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Failed to add admin'), backgroundColor: Colors.redAccent),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFD97706),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Add Admin', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _deleteAdmin(String id, String email) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Revoke Access?', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to remove $email from admin team?', style: TextStyle(color: Colors.white.withOpacity(0.7))),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel', style: TextStyle(color: Colors.white54))),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            child: const Text('Remove', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      final res = await http.delete(Uri.parse('$_apiBase/api/admins/$id'));
      if (res.statusCode == 200) {
        _fetchAdmins();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('$email removed from admins'), backgroundColor: const Color(0xFF1E293B)),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error deleting admin'), backgroundColor: Colors.redAccent),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
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
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 20, 16),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.white.withOpacity(0.08)),
                        ),
                        child: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 18),
                      ),
                    ),
                    const SizedBox(width: 14),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Team & Admins', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: -0.5)),
                        Text('Server PostgreSQL Storage', style: TextStyle(fontSize: 12, color: Colors.white38)),
                      ],
                    ),
                    const Spacer(),
                    GestureDetector(
                      onTap: _showAddAdminDialog,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [Color(0xFFD97706), Color(0xFFF59E0B)]),
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: [
                            BoxShadow(color: const Color(0xFFD97706).withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4)),
                          ],
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.person_add_alt_1_rounded, color: Colors.white, size: 18),
                            SizedBox(width: 6),
                            Text('Add', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Admins list
              Expanded(
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator(color: Color(0xFFD97706), strokeWidth: 2.5))
                    : _error != null
                        ? Center(child: Text(_error!, style: const TextStyle(color: Colors.redAccent)))
                        : ListView.separated(
                            padding: const EdgeInsets.all(20),
                            itemCount: _admins.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 12),
                            itemBuilder: (context, idx) {
                              final admin = _admins[idx];
                              final email = admin['email'] ?? '';
                              final role = admin['role'] ?? 'admin';
                              final isSuper = role == 'superadmin';

                              return Container(
                                padding: const EdgeInsets.all(18),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.04),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: isSuper ? const Color(0xFFD97706).withOpacity(0.3) : Colors.white.withOpacity(0.06),
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 44,
                                      height: 44,
                                      decoration: BoxDecoration(
                                        color: isSuper ? const Color(0xFFD97706).withOpacity(0.15) : Colors.white.withOpacity(0.05),
                                        borderRadius: BorderRadius.circular(14),
                                      ),
                                      child: Icon(
                                        isSuper ? Icons.shield_rounded : Icons.person_rounded,
                                        color: isSuper ? const Color(0xFFD97706) : Colors.white70,
                                        size: 22,
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            email,
                                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: isSuper ? const Color(0xFFD97706).withOpacity(0.15) : Colors.white.withOpacity(0.06),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              role.toUpperCase(),
                                              style: TextStyle(
                                                color: isSuper ? const Color(0xFFD97706) : Colors.white54,
                                                fontSize: 10,
                                                fontWeight: FontWeight.w700,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (email != 'ashishraimsd@gmail.com')
                                      IconButton(
                                        icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 20),
                                        onPressed: () => _deleteAdmin(admin['id'], email),
                                      ),
                                  ],
                                ),
                              );
                            },
                          ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
