'use client';
import { useAuth } from '@/components/AuthProvider';
import { fetchEncryptedJson, decryptEnvelope } from '@/lib/apiCrypto';
import { 
  LogOut, PenTool, LayoutDashboard, Users, Plus, Trash2, Shield, ShieldCheck, 
  FileText, X, CheckCircle2, AlertCircle, ExternalLink, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import RichDocEditor from '@/components/RichDocEditor';

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
  const [postContentHtml, setPostContentHtml] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [postMsg, setPostMsg] = useState<{ text: string; error?: boolean } | null>(null);

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
    if (!postTitle.trim() || !postContentHtml.trim()) {
      alert('Please fill article title and write some content');
      return;
    }
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
          content: postContentHtml.trim(),
          image_url: postImageUrl.trim() || undefined,
          author: 'Adv. Ashutosh Ojha',
        }),
      });

      if (res.ok) {
        await decryptEnvelope(await res.json());
        setPostMsg({ text: 'Article published successfully to live website!' });
        setPostTitle('');
        setPostExcerpt('');
        setPostImageUrl('');
        setPostContentHtml('');
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
                <p className="text-gray-400 text-sm mt-1">Publish &amp; manage legal articles with Google Docs style editor</p>
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
                <h3 className="text-gray-400 text-sm font-medium mb-2">Cloudflare R2 Storage</h3>
                <p className="text-lg font-bold text-emerald-400 mt-1 flex items-center">
                  <Sparkles className="w-5 h-5 mr-1" /> Active &amp; Connected
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

      {/* Google Docs Style Post Publishing Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 border border-amber-500/25">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Google Docs Style Article Publisher</h2>
                    <p className="text-xs text-gray-400">Direct drag &amp; drop / paste images uploaded to Cloudflare R2</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPostModal(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Editor Form Body */}
              <form onSubmit={handleCreatePost} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
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

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">CARD PREVIEW SUMMARY / EXCERPT</label>
                  <textarea 
                    rows={2}
                    placeholder="Short 1-2 sentence overview for the card summary..."
                    value={postExcerpt}
                    onChange={(e) => setPostExcerpt(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Google Docs Style WYSIWYG Editor */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    DOCUMENT BODY &amp; MEDIA (WYSIWYG CANVAS)
                  </label>
                  <RichDocEditor
                    initialHtml={postContentHtml}
                    onChange={setPostContentHtml}
                    coverImage={postImageUrl}
                    onCoverChange={setPostImageUrl}
                  />
                </div>

                {postMsg && (
                  <div className={`p-4 rounded-xl flex items-center text-sm ${
                    postMsg.error ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {postMsg.error ? <AlertCircle className="w-5 h-5 mr-2 shrink-0" /> : <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />}
                    {postMsg.text}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
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
                    className="px-8 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center"
                  >
                    {submittingPost ? 'Publishing...' : 'Publish to Live Site'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
