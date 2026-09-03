import 'package:flutter/material.dart';
import '../services/api_crypto.dart';

class BlogManagerScreen extends StatefulWidget {
  const BlogManagerScreen({super.key});

  @override
  State<BlogManagerScreen> createState() => _BlogManagerScreenState();
}

class _BlogManagerScreenState extends State<BlogManagerScreen> {
  static const String _apiBase = 'https://ashutosh-api.toonshala.com';
  List<dynamic> _blogs = [];
  bool _isLoading = true;
  String? _error;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _fetchBlogs();
  }

  Future<void> _fetchBlogs() async {
    setState(() { _isLoading = true; _error = null; });
    try {
      final data = await ApiClient.get('$_apiBase/api/blogs');
      setState(() {
        _blogs = data is List ? data : [];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Connection to server failed';
        _isLoading = false;
      });
    }
  }

  void _showCreateBlogBottomSheet() {
    final titleController = TextEditingController();
    final excerptController = TextEditingController();
    final contentController = TextEditingController();
    String category = 'Legal Insights';
    bool isPublishing = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setSheetState) => Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          child: SafeArea(
            top: false,
            bottom: true,
            child: Container(
              height: MediaQuery.of(context).size.height * 0.85,
              decoration: const BoxDecoration(
                color: Color(0xFF0F172A),
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                boxShadow: [BoxShadow(color: Colors.black54, blurRadius: 30, spreadRadius: 5)],
              ),
              padding: EdgeInsets.fromLTRB(24, 16, 24, 24 + MediaQuery.of(context).padding.bottom),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 4,
                    decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF6366F1).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(Icons.edit_note_rounded, color: Color(0xFF818CF8), size: 24),
                    ),
                    const SizedBox(width: 14),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Create Blog Article', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                        Text('Publish to website & blog section', style: TextStyle(color: Colors.white54, fontSize: 11)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Title
                        const Text('ARTICLE TITLE', style: TextStyle(color: Colors.white60, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1)),
                        const SizedBox(height: 6),
                        TextField(
                          controller: titleController,
                          style: const TextStyle(color: Colors.white, fontSize: 14),
                          decoration: InputDecoration(
                            hintText: 'e.g. Navigating Commercial Arbitration in India',
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 13),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.04),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: Colors.white.withOpacity(0.08))),
                            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: Colors.white.withOpacity(0.08))),
                            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFF6366F1))),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Category
                        const Text('CATEGORY', style: TextStyle(color: Colors.white60, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1)),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.04),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: Colors.white.withOpacity(0.08)),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: category,
                              isExpanded: true,
                              dropdownColor: const Color(0xFF1E293B),
                              style: const TextStyle(color: Colors.white, fontSize: 14),
                              items: const [
                                DropdownMenuItem(value: 'Legal Insights', child: Text('Legal Insights')),
                                DropdownMenuItem(value: 'Corporate Law', child: Text('Corporate Law')),
                                DropdownMenuItem(value: 'Civil Disputes', child: Text('Civil Disputes')),
                                DropdownMenuItem(value: 'High Court Updates', child: Text('High Court Updates')),
                              ],
                              onChanged: (val) {
                                if (val != null) setSheetState(() => category = val);
                              },
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Excerpt
                        const Text('SHORT SUMMARY / EXCERPT', style: TextStyle(color: Colors.white60, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1)),
                        const SizedBox(height: 6),
                        TextField(
                          controller: excerptController,
                          maxLines: 2,
                          style: const TextStyle(color: Colors.white, fontSize: 13),
                          decoration: InputDecoration(
                            hintText: 'Brief 1-2 sentence overview for the card preview...',
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 12),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.04),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: Colors.white.withOpacity(0.08))),
                            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: Colors.white.withOpacity(0.08))),
                            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFF6366F1))),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Full Content
                        const Text('FULL ARTICLE CONTENT', style: TextStyle(color: Colors.white60, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1)),
                        const SizedBox(height: 6),
                        TextField(
                          controller: contentController,
                          maxLines: 7,
                          style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.5),
                          decoration: InputDecoration(
                            hintText: 'Write the complete legal analysis or article content here...',
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 12),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.04),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: Colors.white.withOpacity(0.08))),
                            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: Colors.white.withOpacity(0.08))),
                            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFF6366F1))),
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),

                // Publish Button
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: isPublishing
                        ? null
                        : () async {
                            final title = titleController.text.trim();
                            final excerpt = excerptController.text.trim();
                            final content = contentController.text.trim();

                            if (title.isEmpty || content.isEmpty) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Please fill title and content'), backgroundColor: Colors.redAccent),
                              );
                              return;
                            }

                            setSheetState(() => isPublishing = true);
                            try {
                              await ApiClient.post('$_apiBase/api/blogs', {
                                'title': title,
                                'category': category,
                                'excerpt': excerpt.isNotEmpty ? excerpt : title,
                                'content': content,
                                'author': 'Adv. Ashutosh Ojha',
                              });
                              if (!mounted) return;
                              Navigator.pop(ctx);
                              _fetchBlogs();
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Blog post published successfully!'), backgroundColor: Color(0xFF10B981), behavior: SnackBarBehavior.floating),
                              );
                            } catch (e) {
                              setSheetState(() => isPublishing = false);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Failed to publish: $e'), backgroundColor: Colors.redAccent),
                              );
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6366F1),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: isPublishing
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Text('Publish Article', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

  Future<void> _deleteBlog(String id, String title) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Delete Article?', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to delete "$title"?', style: TextStyle(color: Colors.white.withOpacity(0.7))),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel', style: TextStyle(color: Colors.white54))),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      await ApiClient.delete('$_apiBase/api/blogs/$id');
      _fetchBlogs();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Article removed'), backgroundColor: Color(0xFF1E293B), behavior: SnackBarBehavior.floating),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error deleting blog: $e'), backgroundColor: Colors.redAccent),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _blogs.where((b) {
      if (_searchQuery.trim().isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      final title = (b['title'] ?? '').toString().toLowerCase();
      final cat = (b['category'] ?? '').toString().toLowerCase();
      return title.contains(q) || cat.contains(q);
    }).toList();

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
                      const Text('Blog Manager', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: -0.5)),
                      Text('${_blogs.length} published articles', style: const TextStyle(fontSize: 12, color: Colors.white38)),
                    ],
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: _fetchBlogs,
                    child: Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: const Color(0xFF6366F1).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.25)),
                      ),
                      child: const Icon(Icons.refresh_rounded, color: Color(0xFF818CF8), size: 20),
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
                  onChanged: (val) => setState(() => _searchQuery = val),
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'Search articles...',
                    hintStyle: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 13),
                    prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF818CF8), size: 20),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Blog List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1)))
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
                                onPressed: _fetchBlogs,
                                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6366F1)),
                                child: const Text('Retry', style: TextStyle(color: Colors.white)),
                              ),
                            ],
                          ),
                        )
                      : filtered.isEmpty
                          ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.menu_book_rounded, size: 54, color: Colors.white24),
                                  const SizedBox(height: 14),
                                  const Text('No blog articles published yet', style: TextStyle(color: Colors.white60, fontSize: 16)),
                                  const SizedBox(height: 6),
                                  Text('Tap the + button below to write your first legal article', style: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 12)),
                                ],
                              ),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.fromLTRB(16, 6, 16, 100),
                              itemCount: filtered.length,
                              itemBuilder: (context, index) {
                                final blog = filtered[index];
                                final title = blog['title'] ?? 'Untitled';
                                final category = blog['category'] ?? 'Legal';
                                final excerpt = blog['excerpt'] ?? '';
                                final author = blog['author'] ?? 'Ashutosh Ojha';
                                final id = blog['id'] ?? '';
                                final createdAt = blog['created_at'] != null ? DateTime.tryParse(blog['created_at'].toString()) : null;

                                return Container(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF131C31),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: Colors.white.withOpacity(0.06)),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFF6366F1).withOpacity(0.15),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              category.toString().toUpperCase(),
                                              style: const TextStyle(color: Color(0xFF818CF8), fontSize: 10, fontWeight: FontWeight.bold),
                                            ),
                                          ),
                                          const Spacer(),
                                          if (createdAt != null)
                                            Text(
                                              '${createdAt.day}/${createdAt.month}/${createdAt.year}',
                                              style: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 11),
                                            ),
                                          const SizedBox(width: 6),
                                          IconButton(
                                            padding: EdgeInsets.zero,
                                            constraints: const BoxConstraints(),
                                            icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 18),
                                            onPressed: () => _deleteBlog(id, title),
                                            tooltip: 'Delete post',
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 10),
                                      Text(title, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                                      if (excerpt.isNotEmpty) ...[
                                        const SizedBox(height: 6),
                                        Text(excerpt, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                                      ],
                                      const SizedBox(height: 12),
                                      Row(
                                        children: [
                                          const Icon(Icons.person_outline_rounded, size: 14, color: Colors.white38),
                                          const SizedBox(width: 4),
                                          Text(author, style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 11)),
                                        ],
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showCreateBlogBottomSheet,
        backgroundColor: const Color(0xFF6366F1),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Write Post', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
    );
  }
}
