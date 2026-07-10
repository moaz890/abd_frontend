'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import { Loader2, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { token } = await loginAdmin(username.trim(), password);
      saveToken(token);
      router.push('/dashboard');
    } catch {
      setError('بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #07263f 0%, #0d3d6b 60%, #1a5f9c 100%)',
        padding: '1.5rem',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '1.25rem',
          padding: '2.5rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo / brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              background: 'linear-gradient(135deg, #1a5f9c, #2e80cc)',
              borderRadius: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#fff',
            }}
          >
            A
          </div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            لوحة التحكم
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
            ABD — اي بي دي
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Username */}
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              اسم المستخدم
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', top: '50%', right: '0.875rem', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.875rem',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '0.625rem', color: '#fff', fontSize: '0.95rem',
                  fontFamily: 'inherit', outline: 'none', direction: 'ltr', textAlign: 'right',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2e80cc')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', top: '50%', right: '0.875rem', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.875rem',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '0.625rem', color: '#fff', fontSize: '0.95rem',
                  fontFamily: 'inherit', outline: 'none', direction: 'ltr',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2e80cc')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: '#fca5a5', fontSize: '0.85rem', textAlign: 'center', padding: '0.5rem', background: 'rgba(239,68,68,0.12)', borderRadius: '0.5rem' }}>
              ⚠ {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.85rem', borderRadius: '0.625rem', fontWeight: 700,
              fontSize: '1rem', fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(46,128,204,0.5)' : 'linear-gradient(135deg, #1a5f9c, #2e80cc)',
              color: '#fff', border: 'none', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s',
              boxShadow: '0 4px 20px rgba(26,95,156,0.4)',
            }}
          >
            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> جارٍ تسجيل الدخول...</> : 'تسجيل الدخول'}
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
