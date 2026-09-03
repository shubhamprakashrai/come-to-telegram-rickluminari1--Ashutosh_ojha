'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

// Replace with the client's actual email once known, or manage via Firestore rules.
// For now, any authenticated Google account can log in, but we can restrict it later.
const ALLOWED_EMAILS = [
  'ashutosh.adv@outlook.com', 
  'solicitiorsworkshop@gmail.com',
  // Temporarily allow all for testing, remove later
];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } else {
        // Logged in
        if (pathname === '/admin/login') {
          router.push('/admin');
        }
        // Optional: Check if email is whitelisted
        // if (user.email && !ALLOWED_EMAILS.includes(user.email)) {
        //   alert("Unauthorized Email");
        //   router.push('/');
        // }
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  // If on login page and not logged in, render login page
  if (!user && pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If logged in and NOT on login page, render admin dashboard
  if (user && pathname !== '/admin/login') {
    return <>{children}</>;
  }

  return null; // Prevents flash of content during redirects
}
