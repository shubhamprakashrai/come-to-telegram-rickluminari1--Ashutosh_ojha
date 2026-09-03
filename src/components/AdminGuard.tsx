'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { fetchEncryptedJson } from '@/lib/apiCrypto';
import { Loader2, ShieldAlert, WifiOff } from 'lucide-react';

type VerifyResult = { authorized: boolean };

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(false);
  // null = not yet checked, true/false = explicit server answer, 'error' = couldn't reach server (retryable, NOT a denial)
  const [authState, setAuthState] = useState<boolean | null | 'error'>(null);

  const verifyWithBackend = useCallback(async (email: string) => {
    setIsVerifying(true);
    try {
      const data = await fetchEncryptedJson<VerifyResult>('https://ashutosh-api.toonshala.com/api/admins/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setAuthState(data.authorized === true);
    } catch (err) {
      // Network failure / server down / bad decrypt — do NOT treat as unauthorized.
      // Doing so would sign real admins out just because the API blipped.
      console.error('Failed to verify admin via server', err);
      setAuthState('error');
    } finally {
      setIsVerifying(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setAuthState(null);
      } else if (user.email) {
        verifyWithBackend(user.email);
      }
    }
  }, [user, loading, pathname, router, verifyWithBackend]);

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

  // Couldn't reach the verify API at all — show a retry screen, never kick the user back to login.
  if (user && authState === 'error' && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
          <WifiOff className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Can't Reach Server</h2>
        <p className="text-gray-400 text-sm max-w-md mb-6">
          The verification server didn&apos;t respond. You&apos;re still signed in as{' '}
          <span className="text-amber-400 font-semibold">{user.email}</span> — this will retry automatically.
        </p>
        <button
          onClick={() => user.email && verifyWithBackend(user.email)}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-medium transition-all"
        >
          Retry Now
        </button>
      </div>
    );
  }

  // If logged in but not authorized in database
  if (user && authState === false && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-gray-400 text-sm max-w-md mb-6">
          The Google account <span className="text-amber-400 font-semibold">{user.email}</span> is not authorized for the admin console.
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
  if (user && authState === true && pathname !== '/admin/login') {
    return <>{children}</>;
  }

  return null;
}
