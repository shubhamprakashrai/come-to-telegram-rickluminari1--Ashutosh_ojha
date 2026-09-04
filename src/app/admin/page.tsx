'use client';
import { useAuth } from '@/components/AuthProvider';
import { fetchEncryptedJson, decryptEnvelope } from '@/lib/apiCrypto';
import { 
  LogOut, PenTool, LayoutDashboard, Users, Plus, Trash2, Shield, ShieldCheck, 
  FileText, X, CheckCircle2, AlertCircle, ExternalLink, Sparkles, FolderKanban,
  Tag, Layers, ArrowRight, PlusCircle, Check, Edit2, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import RichDocEditor from '@/components/RichDocEditor';
import { deleteArticleImagesFromR2 } from '@/lib/r2Upload';

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

type CategoryItem = {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'admins'>('overview');
  
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

  // Categories state (Synced with PostgreSQL)
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryInput, setEditCategoryInput] = useState('');
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');
  const [categoryMsg, setCategoryMsg] = useState<{ text: string; error?: boolean } | null>(null);
  
  // Editor form state
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postContentHtml, setPostContentHtml] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [postMsg, setPostMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const data = await fetchEncryptedJson<CategoryItem[]>('https://ashutosh-api.toonshala.com/api/categories');
      setCategories(data || []);
      if (data && data.length > 0 && !postCategory) {
        setPostCategory(data[0].name);
      }
    } catch (e) {
      console.error('Failed to fetch categories from PostgreSQL', e);
    } finally {
      setLoadingCategories(false);
    }
  }, [postCategory]);

  const handleAddCategory = async (nameToAdd: string) => {
    const trimmed = nameToAdd.trim();
    if (!trimmed) return;
    try {
      const res = await fetch('https://ashutosh-api.toonshala.com/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, description: 'Specialized legal advisory and litigation representation.' }),
      });
      if (res.ok) {
        setCategoryMsg({ text: `Category "${trimmed}" created in database!` });
        setNewCategoryInput('');
        fetchCategories();
        setTimeout(() => setCategoryMsg(null), 2500);
      } else {
        setCategoryMsg({ text: 'Failed to create category', error: true });
      }
    } catch (e) {
      console.error(e);
      setCategoryMsg({ text: 'Error connecting to database', error: true });
    }
  };

  const handleUpdateCategory = async (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setEditingCategoryId(null);
      return;
    }
    try {
      const res = await fetch(`https://ashutosh-api.toonshala.com/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      if (res.ok) {
        setEditingCategoryId(null);
        setCategoryMsg({ text: `Category updated to "${trimmed}"!` });
        fetchCategories();
        setTimeout(() => setCategoryMsg(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? It will also be removed from the Homepage Practice Areas.`)) return;
    try {
      const res = await fetch(`https://ashutosh-api.toonshala.com/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategoryMsg({ text: `Category "${name}" removed from database and homepage.` });
        fetchCategories();
        setTimeout(() => setCategoryMsg(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
    fetchCategories();
    if (activeTab === 'admins') {
      fetchAdmins();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else {
      fetchBlogs();
    }
  }, [activeTab, fetchAdmins, fetchBlogs, fetchCategories]);

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
        setAdminMsg({ text: `Admin access granted to ${newEmail}!` });
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
    
    const finalCategory = (isAddingNewCat && customCatInput.trim()) ? customCatInput.trim() : (postCategory || (categories[0]?.name ?? 'General Law'));
    if (!finalCategory) {
      alert('Please select or specify a practice category');
      return;
    }
    if (!postTitle.trim() || !postContentHtml.trim()) {
      alert('Please fill article title and write some content');
      return;
    }

    if (isAddingNewCat && customCatInput.trim()) {
      handleAddCategory(customCatInput.trim());
    }

    setSubmittingPost(true);
    setPostMsg(null);

    try {
      const res = await fetch('https://ashutosh-api.toonshala.com/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle.trim(),
          category: finalCategory,
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
        setIsAddingNewCat(false);
        setCustomCatInput('');
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
    if (!confirm(`Are you sure you want to delete "${title}"? This will also remove all associated images from Cloudflare R2.`)) return;

    const blogToDelete = blogs.find(b => b.id === id);

    try {
      if (blogToDelete) {
        await deleteArticleImagesFromR2(blogToDelete);
      }

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
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'categories' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderKanban className="w-5 h-5 mr-3" />
            Practice Categories
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
                <p className="text-gray-400 text-sm mt-1">Publish & manage legal articles with Google Docs style editor</p>
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
              <div 
                onClick={() => setActiveTab('categories')}
                className="bg-slate-900 border border-white/5 p-6 rounded-2xl cursor-pointer hover:border-amber-500/30 transition-all group"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-gray-400 text-sm font-medium">Practice Categories</h3>
                  <span className="text-xs text-amber-400 group-hover:underline flex items-center">
                    Manage <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-amber-400">{categories.length}</p>
              </div>
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Cloudflare R2 Storage</h3>
                <p className="text-lg font-bold text-emerald-400 mt-1 flex items-center">
                  <Sparkles className="w-5 h-5 mr-1" /> Active & Connected
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
                <div className="p-16 flex flex-col items-center justify-center space-y-3">
                  <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Loading articles...</p>
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
                          <a 
                            href={`/blogs/${blog.slug}`} 
                            target="_blank" 
                            className="text-base font-bold text-white hover:text-amber-400 transition-colors inline-block"
                          >
                            {blog.title}
                          </a>
                          <p className="text-sm text-gray-400 line-clamp-2">{blog.excerpt}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 ml-6">
                        <a
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          className="text-gray-400 hover:text-amber-400 p-2 rounded-lg hover:bg-white/5 transition-colors"
                          title="View live article"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleDeleteBlog(blog.id, blog.title)}
                          className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === 'categories' ? (
          /* Practice Categories Management Tab */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Practice Categories</h1>
              <p className="text-gray-400 text-sm">
                Add, rename, or delete practice domains. All updates automatically sync with Homepage Practice Areas, Blog Filters, and the Article Editor.
              </p>
            </div>

            {/* Add Category Form */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <PlusCircle className="w-5 h-5 text-amber-500 mr-2" />
                Add New Practice Category
              </h2>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddCategory(newCategoryInput);
                }} 
                className="flex gap-4"
              >
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Cyber Law & Data Privacy, Real Estate & RERA, Maritime Law..." 
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                />
                <button 
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all shadow-md flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Category
                </button>
              </form>

              {categoryMsg && (
                <p className={`mt-3 text-sm ${categoryMsg.error ? 'text-red-400' : 'text-emerald-400'}`}>
                  {categoryMsg.text}
                </p>
              )}
            </div>

            {/* Categories List Grid */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h2 className="text-lg font-semibold text-white">Active Categories ({categories.length})</h2>
                <button onClick={fetchCategories} className="text-xs text-amber-400 hover:underline">
                  Refresh List
                </button>
              </div>

              {loadingCategories ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No categories found in database.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => {
                    const articleCount = blogs.filter(b => b.category.toLowerCase() === cat.name.toLowerCase()).length;
                    const isEditing = editingCategoryId === cat.id;

                    return (
                      <div 
                        key={cat.id} 
                        className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex flex-col justify-between hover:border-amber-500/30 transition-all space-y-3"
                      >
                        {isEditing ? (
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={editCategoryInput}
                              onChange={(e) => setEditCategoryInput(e.target.value)}
                              className="flex-1 bg-slate-900 border border-amber-500 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateCategory(cat.id, editCategoryInput)}
                              className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCategoryId(null)}
                              className="p-1.5 bg-white/5 text-gray-400 hover:bg-white/10 rounded-lg"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 shrink-0">
                                <Tag className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{cat.name}</p>
                                <p className="text-xs text-gray-500">{articleCount} published {articleCount === 1 ? 'article' : 'articles'}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => {
                                  setEditingCategoryId(cat.id);
                                  setEditCategoryInput(cat.name);
                                }}
                                className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors"
                                title="Rename Category"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-white/5 flex justify-end">
                          <button
                            onClick={() => {
                              setPostCategory(cat.name);
                              setShowPostModal(true);
                            }}
                            className="px-3 py-1 bg-white/5 hover:bg-amber-500/15 text-gray-300 hover:text-amber-400 rounded-lg text-xs font-semibold border border-white/5 transition-all flex items-center"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Write in this domain
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Admins Management Tab */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Admin Team</h1>
              <p className="text-gray-400 text-sm">
                Control which Google accounts have access to this Web Admin console and the Mobile Admin App.
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
                  Refresh List
                </button>
              </div>

              {loadingAdmins ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Loading authorized admins...</p>
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
                    <p className="text-xs text-gray-400">Direct drag & drop / paste images uploaded to Cloudflare R2</p>
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
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-gray-400">PRACTICE CATEGORY *</label>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                        className="text-[11px] text-amber-400 hover:underline flex items-center font-medium"
                      >
                        {isAddingNewCat ? 'Choose Existing' : '+ Type Custom Category'}
                      </button>
                    </div>

                    {isAddingNewCat ? (
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Cyber Law, Taxation, Real Estate..."
                          value={customCatInput}
                          onChange={(e) => setCustomCatInput(e.target.value)}
                          className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">
                          New
                        </span>
                      </div>
                    ) : (
                      <select 
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    )}
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
                    DOCUMENT BODY & MEDIA (WYSIWYG CANVAS)
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
