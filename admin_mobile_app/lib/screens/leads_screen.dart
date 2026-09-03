import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_crypto.dart';

class LeadsScreen extends StatefulWidget {
  const LeadsScreen({super.key});

  @override
  State<LeadsScreen> createState() => _LeadsScreenState();
}

class _LeadsScreenState extends State<LeadsScreen> with SingleTickerProviderStateMixin {
  List<dynamic> _allLeads = [];
  List<dynamic> _filteredLeads = [];
  bool _isLoading = true;
  String? _error;

  // Pagination & Filtering state
  String _searchQuery = '';
  String _selectedCategory = 'all';
  int _currentPage = 1;
  static const int _pageSize = 8;

  final TextEditingController _searchController = TextEditingController();
  static const String _apiBase = 'https://ashutosh-api.toonshala.com';

  @override
  void initState() {
    super.initState();
    _fetchLeads();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchLeads() async {
    setState(() { _isLoading = true; _error = null; });
    try {
      final data = await ApiClient.get('$_apiBase/api/leads');
      if (mounted) {
        setState(() {
          _allLeads = data is List ? data : [];
          _isLoading = false;
          _applyFilters();
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Failed to load leads from server';
          _isLoading = false;
        });
      }
    }
  }

  void _applyFilters() {
    List<dynamic> list = List.from(_allLeads);

    // Filter by category
    if (_selectedCategory != 'all') {
      list = list.where((lead) {
        final qType = (lead['query_type'] ?? '').toString().toLowerCase();
        return qType.contains(_selectedCategory.toLowerCase());
      }).toList();
    }

    // Filter by search query
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      list = list.where((lead) {
        final name = (lead['name'] ?? '').toString().toLowerCase();
        final email = (lead['email'] ?? '').toString().toLowerCase();
        final phone = (lead['phone'] ?? '').toString().toLowerCase();
        final message = (lead['message'] ?? '').toString().toLowerCase();
        final queryType = (lead['query_type'] ?? '').toString().toLowerCase();
        return name.contains(q) || email.contains(q) || phone.contains(q) || message.contains(q) || queryType.contains(q);
      }).toList();
    }

    setState(() {
      _filteredLeads = list;
      _currentPage = 1; // Reset to first page on search/filter change
    });
  }

  List<dynamic> get _paginatedLeads {
    final startIndex = (_currentPage - 1) * _pageSize;
    if (startIndex >= _filteredLeads.length) return [];
    final endIndex = (startIndex + _pageSize).clamp(0, _filteredLeads.length);
    return _filteredLeads.sublist(startIndex, endIndex);
  }

  int get _totalPages {
    if (_filteredLeads.isEmpty) return 1;
    return (_filteredLeads.length / _pageSize).ceil();
  }

  Future<void> _makePhoneCall(String phoneNumber) async {
    final cleanPhone = phoneNumber.replaceAll(RegExp(r'[^\d+]'), '');
    final uri = Uri.parse('tel:$cleanPhone');
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri);
      } else {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not launch call: $e'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  Future<void> _openWhatsApp(String phoneNumber) async {
    final cleanPhone = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');
    final uri = Uri.parse('https://wa.me/$cleanPhone');
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not open WhatsApp: $e'), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  void _showLeadDetail(Map<String, dynamic> lead) {
    final name = lead['name'] ?? 'Anonymous';
    final email = lead['email'] ?? '';
    final phone = lead['phone'] ?? '';
    final queryType = lead['query_type'] ?? 'General Consultation';
    final message = lead['message'] ?? 'No details provided';
    final createdAt = lead['created_at'] != null ? DateTime.tryParse(lead['created_at'].toString()) : null;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        decoration: const BoxDecoration(
          color: Color(0xFF0F172A),
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          boxShadow: [BoxShadow(color: Colors.black54, blurRadius: 30, spreadRadius: 5)],
        ),
        padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 20),
              
              // Client Name & Badge
              Row(
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: const Color(0xFFD97706).withOpacity(0.18),
                    child: Text(
                      name.isNotEmpty ? name[0].toUpperCase() : '?',
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFFD97706)),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(name, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFD97706).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            queryType.toString().toUpperCase(),
                            style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 10, fontWeight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Action Buttons: Call & WhatsApp
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: phone.isNotEmpty ? () => _makePhoneCall(phone) : null,
                      icon: const Icon(Icons.call_rounded, size: 18),
                      label: const Text('Call Client', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: phone.isNotEmpty ? () => _openWhatsApp(phone) : null,
                      icon: const Icon(Icons.chat_bubble_outline_rounded, size: 18),
                      label: const Text('WhatsApp', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF059669),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Contact Info Details
              _DetailCard(
                icon: Icons.phone_android_rounded,
                label: 'Phone Number',
                value: phone,
                onCopy: () {
                  Clipboard.setData(ClipboardData(text: phone));
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Phone copied!'), behavior: SnackBarBehavior.floating));
                },
              ),
              const SizedBox(height: 10),
              _DetailCard(
                icon: Icons.email_outlined,
                label: 'Email Address',
                value: email,
                onCopy: () {
                  Clipboard.setData(ClipboardData(text: email));
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Email copied!'), behavior: SnackBarBehavior.floating));
                },
              ),
              const SizedBox(height: 10),
              if (createdAt != null)
                _DetailCard(
                  icon: Icons.calendar_today_rounded,
                  label: 'Submission Date',
                  value: '${createdAt.day}/${createdAt.month}/${createdAt.year} at ${createdAt.hour}:${createdAt.minute.toString().padLeft(2, '0')}',
                ),
              const SizedBox(height: 16),

              // Legal Query Message
              const Text('INQUIRY DETAILS', style: TextStyle(color: Colors.white60, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1)),
              const SizedBox(height: 8),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: SelectableText(
                  message,
                  style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.5),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final paginated = _paginatedLeads;

    return Scaffold(
      backgroundColor: const Color(0xFF0A0F1E),
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 20, 12),
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
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Client Leads', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: -0.5)),
                      Text('${_allLeads.length} total consultations', style: const TextStyle(fontSize: 12, color: Colors.white38)),
                    ],
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: _fetchLeads,
                    child: Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: const Color(0xFFD97706).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFD97706).withOpacity(0.25)),
                      ),
                      child: const Icon(Icons.refresh_rounded, color: Color(0xFFD97706), size: 20),
                    ),
                  ),
                ],
              ),
            ),

            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF131C31),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.06)),
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: (val) {
                    _searchQuery = val;
                    _applyFilters();
                  },
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'Search by name, email, query...',
                    hintStyle: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 13),
                    prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFFD97706), size: 20),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded, color: Colors.white38, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              _searchQuery = '';
                              _applyFilters();
                            },
                          )
                        : null,
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ),

            // Category Filter Chips
            SizedBox(
              height: 48,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                children: [
                  _FilterChip(
                    label: 'All (${_allLeads.length})',
                    isSelected: _selectedCategory == 'all',
                    onTap: () {
                      setState(() => _selectedCategory = 'all');
                      _applyFilters();
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Corporate',
                    isSelected: _selectedCategory == 'corporate',
                    onTap: () {
                      setState(() => _selectedCategory = 'corporate');
                      _applyFilters();
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Civil',
                    isSelected: _selectedCategory == 'civil',
                    onTap: () {
                      setState(() => _selectedCategory = 'civil');
                      _applyFilters();
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Consultation',
                    isSelected: _selectedCategory == 'consultation',
                    onTap: () {
                      setState(() => _selectedCategory = 'consultation');
                      _applyFilters();
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'Documentation',
                    isSelected: _selectedCategory == 'documentation',
                    onTap: () {
                      setState(() => _selectedCategory = 'documentation');
                      _applyFilters();
                    },
                  ),
                ],
              ),
            ),

            // Leads List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator(color: Color(0xFFD97706)))
                  : _error != null
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.cloud_off_rounded, size: 48, color: Colors.white24),
                              const SizedBox(height: 12),
                              Text(_error!, style: const TextStyle(color: Colors.white60)),
                              const SizedBox(height: 12),
                              ElevatedButton(
                                onPressed: _fetchLeads,
                                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFD97706)),
                                child: const Text('Retry', style: TextStyle(color: Colors.white)),
                              ),
                            ],
                          ),
                        )
                      : _filteredLeads.isEmpty
                          ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.inbox_outlined, size: 54, color: Colors.white24),
                                  const SizedBox(height: 14),
                                  const Text('No leads match your criteria', style: TextStyle(color: Colors.white60, fontSize: 16)),
                                  const SizedBox(height: 6),
                                  Text('Try clearing the search query or filter', style: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 12)),
                                ],
                              ),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.fromLTRB(16, 6, 16, 12),
                              itemCount: paginated.length,
                              itemBuilder: (context, index) {
                                final lead = paginated[index] as Map<String, dynamic>;
                                final name = lead['name'] ?? 'Client';
                                final phone = lead['phone'] ?? '';
                                final email = lead['email'] ?? '';
                                final queryType = lead['query_type'] ?? 'General';
                                final message = lead['message'] ?? '';

                                return Container(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF131C31),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: Colors.white.withOpacity(0.06)),
                                  ),
                                  child: Material(
                                    color: Colors.transparent,
                                    child: InkWell(
                                      onTap: () => _showLeadDetail(lead),
                                      borderRadius: BorderRadius.circular(20),
                                      child: Padding(
                                        padding: const EdgeInsets.all(16),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                CircleAvatar(
                                                  radius: 20,
                                                  backgroundColor: const Color(0xFFD97706).withOpacity(0.18),
                                                  child: Text(
                                                    name.isNotEmpty ? name[0].toUpperCase() : '?',
                                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFFD97706)),
                                                  ),
                                                ),
                                                const SizedBox(width: 12),
                                                Expanded(
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      Text(name, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                                                      const SizedBox(height: 2),
                                                      Text(email, style: TextStyle(color: Colors.white.withOpacity(0.45), fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis),
                                                    ],
                                                  ),
                                                ),
                                                Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                                  decoration: BoxDecoration(
                                                    color: const Color(0xFFD97706).withOpacity(0.15),
                                                    borderRadius: BorderRadius.circular(6),
                                                  ),
                                                  child: Text(
                                                    queryType.toString().toUpperCase(),
                                                    style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 9, fontWeight: FontWeight.w800),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 12),
                                            Text(
                                              message,
                                              style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 13),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 14),
                                            
                                            // Bottom Quick Actions: Call, WhatsApp, View
                                            Row(
                                              children: [
                                                if (phone.isNotEmpty) ...[
                                                  InkWell(
                                                    onTap: () => _makePhoneCall(phone),
                                                    borderRadius: BorderRadius.circular(10),
                                                    child: Container(
                                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                                      decoration: BoxDecoration(
                                                        color: const Color(0xFF10B981).withOpacity(0.15),
                                                        borderRadius: BorderRadius.circular(10),
                                                        border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
                                                      ),
                                                      child: Row(
                                                        children: [
                                                          const Icon(Icons.phone_rounded, color: Color(0xFF10B981), size: 14),
                                                          const SizedBox(width: 6),
                                                          Text(phone, style: const TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.bold)),
                                                        ],
                                                      ),
                                                    ),
                                                  ),
                                                  const SizedBox(width: 8),
                                                  InkWell(
                                                    onTap: () => _openWhatsApp(phone),
                                                    borderRadius: BorderRadius.circular(10),
                                                    child: Container(
                                                      padding: const EdgeInsets.all(6),
                                                      decoration: BoxDecoration(
                                                        color: const Color(0xFF059669).withOpacity(0.15),
                                                        borderRadius: BorderRadius.circular(10),
                                                        border: Border.all(color: const Color(0xFF059669).withOpacity(0.3)),
                                                      ),
                                                      child: const Icon(Icons.chat_bubble_outline_rounded, color: Color(0xFF34D399), size: 16),
                                                    ),
                                                  ),
                                                ],
                                                const Spacer(),
                                                const Text('View Details', style: TextStyle(color: Color(0xFFD97706), fontSize: 12, fontWeight: FontWeight.w600)),
                                                const SizedBox(width: 4),
                                                const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFFD97706), size: 11),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
            ),

            // Pagination Controls Footer
            if (_filteredLeads.isNotEmpty)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  border: Border(top: BorderSide(color: Colors.white.withOpacity(0.06))),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Showing ${((_currentPage - 1) * _pageSize + 1)}-${((_currentPage * _pageSize)).clamp(0, _filteredLeads.length)} of ${_filteredLeads.length}',
                      style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 12),
                    ),
                    Row(
                      children: [
                        IconButton(
                          onPressed: _currentPage > 1 ? () => setState(() => _currentPage--) : null,
                          icon: const Icon(Icons.chevron_left_rounded),
                          color: Colors.white,
                          disabledColor: Colors.white12,
                          iconSize: 22,
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFD97706).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '$_currentPage / $_totalPages',
                            style: const TextStyle(color: Color(0xFFF59E0B), fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                        ),
                        IconButton(
                          onPressed: _currentPage < _totalPages ? () => setState(() => _currentPage++) : null,
                          icon: const Icon(Icons.chevron_right_rounded),
                          color: Colors.white,
                          disabledColor: Colors.white12,
                          iconSize: 22,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFD97706) : Colors.white.withOpacity(0.04),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFFD97706) : Colors.white.withOpacity(0.08),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.white60,
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ),
    );
  }
}

class _DetailCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final VoidCallback? onCopy;

  const _DetailCard({required this.icon, required this.label, required this.value, this.onCopy});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFFD97706), size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 11)),
                const SizedBox(height: 2),
                Text(value, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
          if (onCopy != null)
            IconButton(
              icon: const Icon(Icons.copy_rounded, color: Colors.white38, size: 18),
              onPressed: onCopy,
              tooltip: 'Copy',
            ),
        ],
      ),
    );
  }
}
