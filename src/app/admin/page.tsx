'use client';
import { useAuth } from '@/components/AuthProvider';
import { fetchEncryptedJson, decryptEnvelope } from '@/lib/apiCrypto';
import { 
  LogOut, PenTool, LayoutDashboard, Users, Plus, Trash2, Shield, ShieldCheck, 
  FileText, X, CheckCircle2, AlertCircle, ExternalLink, Image as ImageIcon,
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon,
  Eye, Edit3, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';

type AdminUser = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  image_url?: string;
  published: boolean;
  created_at: string;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'admins'>('overview');
  
  // Admins state
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  const [adminMsg, setAdminMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Blogs state
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  
  // Editor form state
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Legal Insights');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postContent, setPostContent] = useState('');
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [postMsg, setPostMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    try {
      const data = await fetchEncryptedJson<AdminUser[]>('https://ashutosh-api.toonshala.com/api/admins');
      setAdmins(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAdmins(false);
    }
  }, []);

  const fetchBlogs = useCallback(async () => {
    setLoadingBlogs(true);
    try {
      const data = await fetchEncryptedJson<BlogPost[]>('https://ashutosh-api.toonshala.com/api/blogs');
      setBlogs(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBlogs(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'admins') {
      fetchAdmins();
    } else {
      fetchBlogs();
    }
  }, [activeTab, fetchAdmins, fetchBlogs]);

  // Editor formatting helper
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = postContent.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = postContent.substring(0, start) + replacement + postContent.substring(end);
    setPostContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const handleInsertImage = () => {
    const url = prompt('Enter Image URL (e.g. https://images.unsplash.com/...):');
    if (url) {
      const caption = prompt('Enter Image Caption / Alt text (optional):') || 'Image';
      insertFormatting(`\n\n![${caption}](${url})\n*${caption}*\n\n`);
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Enter Destination URL (https://...):');
    if (url) {
      insertFormatting('[', `](${url})`, 'Link Text');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setSubmittingAdmin(true);
    setAdminMsg(null);

    try {
      const res = await fetch('https://ashutosh-api.toonshala.com/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim(), role: newRole }),
      });

      if (res.ok) {
        await decryptEnvelope(await res.json());
        setAdminMsg({ text: `Admin ${newEmail} added to PostgreSQL!` });
        setNewEmail('');
        fetchAdmins();
      } else {
        setAdminMsg({ text: 'Failed to add admin', error: true });
      }
    } catch (e) {
      setAdminMsg({ text: 'Error connecting to server', error: true });
    } finally {
      setSubmittingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;

    try {
      const res = await fetch(`https://ashutosh-api.toonshala.com/api/admins/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAdmins(prev => prev.filter(a => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    setSubmittingPost(true);
    setPostMsg(null);

    try {
      const res = await fetch('https://ashutosh-api.toonshala.com/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle.trim(),
          category: postCategory,
          excerpt: postExcerpt.trim() || postTitle.trim(),
          content: postContent.trim(),
          image_url: postImageUrl.trim() || undefined,
          author: 'Adv. Ashutosh Ojha',
        }),
      });

      if (res.ok) {
        await decryptEnvelope(await res.json());
        setPostMsg({ text: 'Article published successfully!' });
        setPostTitle('');
        setPostExcerpt('');
        setPostImageUrl('');
        setPostContent('');
        setTimeout(() => {
          setShowPostModal(false);
          setPostMsg(null);
        }, 1200);
        fetchBlogs();
      } else {
        setPostMsg({ text: 'Failed to publish post', error: true });
      }
    } catch (e) {
      setPostMsg({ text: 'Server connection error', error: true });
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`https://ashutosh-api.toonshala.com/api/blogs/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simple visual markdown renderer for preview tab
  const renderFormattedPreview = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-4 text-gray-200 text-sm leading-relaxed">
        {lines.map((line, i) => {
          if (line.startsWith('### ')) {
            return <h3 key={i} className="text-lg font-bold text-amber-400 mt-6 mb-2">{line.replace('### ', '')}</h3>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3 border-b border-white/10 pb-2">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('# ')) {
            return <h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{line.replace('# ', '')}</h1>;
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={i} className="border-l-4 border-amber-500 pl-4 py-1 italic text-amber-200/90 bg-amber-500/5 rounded-r-lg my-3">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <li key={i} className="ml-5 list-disc text-gray-300">
                {line.replace(/^[-*]\s+/, '')}
              </li>
            );
          }
          // Check for image syntax: ![alt](url)
          const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
          if (imgMatch) {
            return (
              <div key={i} className="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-950">
                <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full max-h-96 object-cover" />
                {imgMatch[1] && <p className="p-2 text-center text-xs text-gray-400 italic bg-slate-900/60">{imgMatch[1]}</p>}
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={i} className="h-2" />;
          }
          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <LayoutDashboard className="w-5 h-5 text-amber-500 mr-2" />
            Admin Panel
          </h2>
          <p className="text-xs text-amber-400/80 mt-1 font-mono">Ashutosh Law Console</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PenTool className="w-5 h-5 mr-3" />
            Overview & Posts
          </button>

          <button 
            onClick={() => setActiveTab('admins')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'admins' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Manage Admins
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center mb-4 px-2">
            <img src={user?.photoURL || ''} alt="Profile" className="w-10 h-10 rounded-full border border-white/10 mr-3" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome, {user?.displayName?.split(' ')[0]}</h1>
                <p className="text-gray-400 text-sm mt-1">Publish &amp; manage legal articles on your portal</p>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href="/blogs"
                  target="_blank"
                  className="flex items-center px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-sm font-medium border border-white/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Public Blog
                </a>
                <button 
                  onClick={() => setShowPostModal(true)}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-amber-500/20 transition-all flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Published Articles</h3>
                <p className="text-3xl font-bold text-white">{blogs.length}</p>
              </div>
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Categories Active</h3>
                <p className="text-3xl font-bold text-amber-400">
                  {new Set(blogs.map(b => b.category)).size}
                </p>
              </div>
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Database Status</h3>
                <p className="text-lg font-bold text-emerald-400 mt-1 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-1" /> PostgreSQL VPS Live
                </p>
              </div>
            </div>

            {/* Posts List */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Articles ({blogs.length})</h2>
                <button onClick={fetchBlogs} className="text-xs text-amber-400 hover:underline">
                  Refresh List
                </button>
              </div>

              {loadingBlogs ? (
                <div className="p-12 text-center text-gray-400 text-sm">
                  Loading articles from VPS PostgreSQL...
                </div>
              ) : blogs.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No articles yet</h3>
                  <p className="text-gray-400 max-w-md mb-6 text-sm">
                    You haven&apos;t published any legal articles yet. Click &quot;New Post&quot; above to create your first article!
                  </p>
                  <button 
                    onClick={() => setShowPostModal(true)}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-medium transition-all"
                  >
                    Write First Post
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="p-6 flex items-start justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start space-x-4 max-w-3xl">
                        {blog.image_url ? (
                          <img src={blog.image_url} alt="" className="w-24 h-20 object-cover rounded-xl border border-white/10 shrink-0" />
                        ) : (
                          <div className="w-24 h-20 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center shrink-0">
                            <PenTool className="w-6 h-6 text-amber-400" />
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {blog.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{blog.author}</span>
                          </div>
                          <h3 className="text-base font-bold text-white">{blog.title}</h3>
                          <p className="text-sm text-gray-400 line-clamp-2">{blog.excerpt}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 ml-6">
                        <button 
                          onClick={() => handleDeleteBlog(blog.id, blog.title)}
                          className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Admin Team</h1>
              <p className="text-gray-400 text-sm">
                Control which Google accounts have access to this Web Admin console and the Mobile Admin App. All records are synced directly in PostgreSQL on your VPS.
              </p>
            </div>

            {/* Add Admin Form */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Plus className="w-5 h-5 text-amber-500 mr-2" />
                Add New Admin
              </h2>
              <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  required
                  placeholder="name@gmail.com" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                />
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
                <button 
                  type="submit"
                  disabled={submittingAdmin}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {submittingAdmin ? 'Adding...' : 'Grant Access'}
                </button>
              </form>
              {adminMsg && (
                <p className={`mt-3 text-sm ${adminMsg.error ? 'text-red-400' : 'text-emerald-400'}`}>
                  {adminMsg.text}
                </p>
              )}
            </div>

            {/* Admin Users List */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Authorized Users ({admins.length})</h2>
                <button onClick={fetchAdmins} className="text-xs text-amber-400 hover:underline">
                  Refresh
                </button>
              </div>

              {loadingAdmins ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Loading admin list from VPS...
                </div>
              ) : admins.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No admins found.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {admins.map((admin) => (
                    <div key={admin.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                          <Shield className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{admin.email}</p>
                          <p className="text-xs text-gray-500">
                            Added on {new Date(admin.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          admin.role === 'superadmin' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                            : 'bg-slate-800 text-gray-300'
                        }`}>
                          {admin.role.toUpperCase()}
                        </span>
                        {admin.email !== 'ashishraimsd@gmail.com' && (
                          <button 
                            onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                            className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="Revoke Admin Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* Rich Editor Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 border border-amber-500/25">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Publish Legal Article &amp; Insights</h2>
                    <p className="text-xs text-gray-400">Rich Markdown &amp; Image Editor with real-time preview</p>
                  </div>
                </div>

                {/* Editor Tabs (Write / Preview) */}
                <div className="flex items-center space-x-2">
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditorMode('write')}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        editorMode === 'write' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        editorMode === 'preview' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Live Preview
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowPostModal(false)}
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <form onSubmit={handleCreatePost} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {editorMode === 'write' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2">ARTICLE TITLE *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Navigating Commercial Arbitration in India"
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2">PRACTICE CATEGORY *</label>
                        <select 
                          value={postCategory}
                          onChange={(e) => setPostCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                        >
                          <option value="Legal Insights">Legal Insights</option>
                          <option value="Corporate Law">Corporate Law</option>
                          <option value="Civil Disputes">Civil Disputes</option>
                          <option value="High Court Updates">High Court Updates</option>
                          <option value="Constitutional Law">Constitutional Law</option>
                          <option value="Arbitration & ADR">Arbitration & ADR</option>
                        </select>
                      </div>
                    </div>

                    {/* Featured Cover Image URL */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2">
                        FEATURED COVER IMAGE URL (OPTIONAL)
                      </label>
                      <div className="flex space-x-3">
                        <div className="relative flex-1">
                          <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="url" 
                            placeholder="https://images.unsplash.com/photo-... or any image link"
                            value={postImageUrl}
                            onChange={(e) => setPostImageUrl(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                      {postImageUrl && (
                        <div className="mt-3 relative w-full h-36 rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                          <img src={postImageUrl} alt="Cover Preview" className="w-full h-full object-cover" onError={() => {}} />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-amber-300 font-mono">
                            Cover Preview
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2">
                        CARD SUMMARY / EXCERPT
                      </label>
                      <textarea 
                        rows={2}
                        placeholder="A brief 1-2 sentence teaser shown on cards..."
                        value={postExcerpt}
                        onChange={(e) => setPostExcerpt(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    {/* Markdown Formatting Toolbar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-gray-400">ARTICLE BODY (MARKDOWN &amp; FORMATTING) *</label>
                        <span className="text-[11px] text-amber-400/80 font-mono">Use toolbar for quick styling</span>
                      </div>

                      {/* Toolbar buttons */}
                      <div className="flex flex-wrap gap-1 p-2 bg-slate-950 border border-white/10 border-b-0 rounded-t-xl text-gray-300">
                        <button
                          type="button"
                          onClick={() => insertFormatting('## ', '', 'Section Heading')}
                          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                          title="Heading 2"
                        >
                          <Heading2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('### ', '', 'Subsection Heading')}
                          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                          title="Heading 3"
                        >
                          <Heading3 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-white/10 my-auto mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('**', '**', 'bold text')}
                          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                          title="Bold"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('*', '*', 'italic text')}
                          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                          title="Italic"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-white/10 my-auto mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('- ', '', 'Bullet point')}
                          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                          title="Bullet List"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('1. ', '', 'Numbered point')}
                          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                          title="Numbered List"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('> ', '', 'Important legal quote or note')}
                          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                          title="Quote Block"
                        >
                          <Quote className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-white/10 my-auto mx-1" />
                        <button
                          type="button"
                          onClick={handleInsertImage}
                          className="flex items-center px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium transition-colors"
                          title="Insert Image"
                        >
                          <ImageIcon className="w-3.5 h-3.5 mr-1" />
                          Add Image
                        </button>
                        <button
                          type="button"
                          onClick={handleInsertLink}
                          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                          title="Insert Link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea 
                        ref={textareaRef}
                        rows={10}
                        required
                        placeholder="Write your legal commentary here... You can use headings (##), bullet points (-), images, and blockquotes (>)."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-b-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 font-mono text-[13px] leading-relaxed"
                      />
                    </div>
                  </>
                ) : (
                  /* Live Preview Tab */
                  <div className="space-y-6 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-white/10 min-h-[400px]">
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/20">
                        {postCategory}
                      </span>
                      <span className="text-gray-400">By Adv. Ashutosh Ojha</span>
                    </div>

                    <h1 className="text-3xl font-extrabold text-white leading-tight">
                      {postTitle || 'Untitled Article Title'}
                    </h1>

                    {postImageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 max-h-72">
                        <img src={postImageUrl} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {postExcerpt && (
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-amber-200/90 text-sm italic">
                        {postExcerpt}
                      </div>
                    )}

                    {postContent ? (
                      renderFormattedPreview(postContent)
                    ) : (
                      <p className="text-gray-500 text-sm italic">No article content written yet. Switch to &quot;Write&quot; tab to type.</p>
                    )}
                  </div>
                )}

                {postMsg && (
                  <div className={`p-4 rounded-xl flex items-center text-sm ${
                    postMsg.error ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {postMsg.error ? <AlertCircle className="w-5 h-5 mr-2 shrink-0" /> : <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />}
                    {postMsg.text}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="text-xs text-gray-500 font-mono">
                    {postContent.trim().split(/\s+/).filter(Boolean).length} words
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setShowPostModal(false)}
                      className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submittingPost}
                      className="px-7 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center"
                    >
                      {submittingPost ? 'Publishing...' : 'Publish Article'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
