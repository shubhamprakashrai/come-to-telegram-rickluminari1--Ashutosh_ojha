import AdminGuard from '@/components/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
        {/* We can add a global admin sidebar or header here later */}
        {children}
      </div>
    </AdminGuard>
  );
}
