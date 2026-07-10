'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken, removeToken } from '@/lib/auth';
import {
  LayoutDashboard,
  FileEdit,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard',         label: 'اللوحة الرئيسية',  icon: LayoutDashboard },
  { href: '/dashboard/content', label: 'إدارة المحتوى',    icon: FileEdit },
  { href: '/dashboard/settings',label: 'الإعدادات',         icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Skip sidebar on the login page
  const isLogin = pathname === '/dashboard/login';

  // Auth guard — client-side check
  useEffect(() => {
    if (!isLogin && !getToken()) {
      router.replace('/dashboard/login');
    }
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;

  function handleLogout() {
    removeToken();
    router.push('/dashboard/login');
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f1f5f9',
        direction: 'rtl',
        fontFamily: 'var(--font-tajawal)',
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          background: 'linear-gradient(180deg, #07263f 0%, #0d3d6b 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          transition: 'transform 0.3s ease',
        }}
        className={`sidebar${sidebarOpen ? ' open' : ''}`}
      >
        {/* Brand */}
        <div
          style={{
            padding: '1.5rem 1.25rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '2.25rem', height: '2.25rem',
              background: 'linear-gradient(135deg, #1a5f9c, #2e80cc)',
              borderRadius: '0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: '1rem', flexShrink: 0,
            }}
          >
            A
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>ABD</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>لوحة التحكم</div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 0.875rem', borderRadius: '0.625rem',
                  textDecoration: 'none', fontWeight: active ? 700 : 500, fontSize: '0.9rem',
                  transition: 'all 0.15s ease',
                  background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.7rem 0.875rem', borderRadius: '0.625rem',
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5', fontWeight: 600, fontSize: '0.875rem',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile top bar */}
        <header
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            height: '56px',
            background: '#0d3d6b',
            color: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
          className="mobile-topbar"
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>ABD — لوحة التحكم</span>
          <div style={{ width: 22 }} />
        </header>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              zIndex: 40, display: 'none',
            }}
            className="mobile-overlay"
          />
        )}

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            top: 56px !important;
            height: calc(100vh - 56px) !important;
            transform: translateX(100%);
          }
          .sidebar.open { transform: translateX(0); }
          .mobile-topbar { display: flex !important; }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
}
