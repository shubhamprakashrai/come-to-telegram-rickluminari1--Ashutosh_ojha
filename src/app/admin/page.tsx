'use client';
import { useAuth } from '@/components/AuthProvider';
import { fetchEncryptedJson, decryptEnvelope } from '@/lib/apiCrypto';
import { LogOut, PenTool, LayoutDashboard, Users, Plus, Trash2, Shield, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type AdminUser = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'admins'>('overview');
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const data = await fetchEncryptedJson<AdminUser[]>('https://ashutosh-api.toonshala.com/api/admins');
      setAdmins(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admins') {
      fetchAdmins();
    }
  }, [activeTab]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch('https://ashutosh-api.toonshala.com/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim(), role: newRole }),
      });

      if (res.ok) {
        await decryptEnvelope(await res.json());
        setMsg({ text: `Admin ${newEmail} added to PostgreSQL!` });
        setNewEmail('');
        fetchAdmins();
      } else {
        setMsg({ text: 'Failed to add admin', error: true });
      }
    } catch (e) {
      setMsg({ text: 'Error connecting to server', error: true });
    } finally {
      setSubmitting(false);
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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col">
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
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Welcome back, {user?.displayName?.split(' ')[0]}</h1>
              <button className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-amber-500/20 transition-all">
                New Post
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Posts</h3>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Views (30d)</h3>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Server Database</h3>
                <p className="text-lg font-bold text-emerald-400 mt-1 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-1" /> Connected
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <PenTool className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 max-w-md mb-6">
                You haven't written any blog posts yet. Click the button above to publish your first article.
              </p>
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
                  disabled={submitting}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Grant Access'}
                </button>
              </form>

              {msg && (
                <p className={`mt-3 text-sm ${msg.error ? 'text-red-400' : 'text-emerald-400'}`}>
                  {msg.text}
                </p>
              )}
            </div>

            {/* Admins Table */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Authorized Users ({admins.length})</h2>
                <button
                  onClick={fetchAdmins}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Refresh
                </button>
              </div>

              {loadingAdmins ? (
                <div className="p-8 text-center text-gray-400 text-sm">Loading admin list from VPS...</div>
              ) : admins.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No admins found.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {admins.map((adm) => (
                    <div key={adm.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                          <Shield className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{adm.email}</p>
                          <p className="text-xs text-gray-500">Added on {new Date(adm.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          adm.role === 'superadmin' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                            : 'bg-slate-800 text-gray-300'
                        }`}>
                          {adm.role.toUpperCase()}
                        </span>

                        {adm.email !== 'ashishraimsd@gmail.com' && (
                          <button
                            onClick={() => handleDeleteAdmin(adm.id, adm.email)}
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
    </div>
  );
}
