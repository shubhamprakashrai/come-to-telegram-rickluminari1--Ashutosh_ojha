'use client';
import { useAuth } from '@/components/AuthProvider';
import { LogOut, PenTool, LayoutDashboard, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center">
            <LayoutDashboard className="w-5 h-5 text-amber-500 mr-2" />
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center px-4 py-3 bg-amber-500/10 text-amber-400 rounded-xl font-medium transition-colors">
            <PenTool className="w-5 h-5 mr-3" />
            Blog Editor
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
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
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
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
            {/* Stats Cards */}
            <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Posts</h3>
              <p className="text-3xl font-bold text-white">0</p>
            </div>
            <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Views (30d)</h3>
              <p className="text-3xl font-bold text-white">0</p>
            </div>
            <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Subscribers</h3>
              <p className="text-3xl font-bold text-white">0</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <PenTool className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
            <p className="text-gray-400 max-w-md mb-6">
              You haven't written any blog posts yet. Click the button above to launch the Rich Text Editor (Phase 3) and publish your first article.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
