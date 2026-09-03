'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function verifyWithBackend(email: string) {
      setIsVerifying(true);
      try {
        const res = await fetch('https://ashutosh-api.toonshala.com/api/admins/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (res.ok) {
          const data = await res.json();
          setIsAuthorized(data.authorized === true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error('Failed to verify admin via server', err);
        setIsAuthorized(false);
      } finally {
        setIsVerifying(false);
      }
    }

    if (!loading) {
      if (!user) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setIsAuthorized(null);
      } else {
        if (user.email) {
          verifyWithBackend(user.email);
        }
      }
    }
  }, [user, loading, pathname, router]);

  if (loading || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-9 h-9 text-amber-500 animate-spin mb-4" />
        <p className="text-sm text-gray-400">Verifying security credentials with server...</p>
      </div>
    );
  }

  // If on login page and not logged in
  if (!user && pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If logged in but not authorized in database
  if (user && isAuthorized === false && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-gray-400 text-sm max-w-md mb-6">
          The Google account <span className="text-amber-400 font-semibold">{user.email}</span> is not registered in the PostgreSQL admin database.
        </p>
        <button
          onClick={logout}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-all"
        >
          Sign In with Different Account
        </button>
      </div>
    );
  }

  // If logged in and authorized
  if (user && isAuthorized === true && pathname !== '/admin/login') {
    return <>{children}</>;
  }

  return null;
}
