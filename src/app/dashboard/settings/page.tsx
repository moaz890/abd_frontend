'use client';

import { useState } from 'react';
import { getToken } from '@/lib/auth';
import { Loader2, CheckCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default function SettingsPage() {
  const token = getToken() ?? '';
  const [form, setForm] = useState({ username: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      setError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const body: Record<string, string> = {};
      if (form.username.trim()) body.username = form.username.trim();
      if (form.currentPassword) {
        body.currentPassword = form.currentPassword;
        body.newPassword = form.newPassword;
      }

      const res = await fetch(`${API}/api/auth/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'حدث خطأ');

      setSuccess('تم حفظ الإعدادات بنجاح ✅');
      setForm({ username: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: '2rem' }}>
        الإعدادات
      </h1>

      <div style={{ background: '#fff', borderRadius: '0.875rem', padding: '2rem', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            أترك الحقل فارغاً إذا لم تريد تغييره.
          </p>

          {[
            { key: 'username', label: 'اسم المستخدم الجديد', type: 'text', placeholder: 'اترك فارغاً للإبقاء على الحالي' },
            { key: 'currentPassword', label: 'كلمة المرور الحالية', type: 'password', placeholder: '••••••••' },
            { key: 'newPassword', label: 'كلمة المرور الجديدة', type: 'password', placeholder: '6 أحرف على الأقل' },
            { key: 'confirmPassword', label: 'تأكيد كلمة المرور الجديدة', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.4rem' }}>
                {label}
              </label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                placeholder={placeholder}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                style={{
                  width: '100%', padding: '0.7rem 0.875rem',
                  border: '1.5px solid #e2e8f0', borderRadius: '0.5rem',
                  fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none',
                  direction: key === 'username' ? 'rtl' : 'ltr', color: '#1e293b',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1a5f9c')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>
          ))}

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.875rem', padding: '0.6rem 0.875rem', background: '#fee2e2', borderRadius: '0.5rem' }}>
              ⚠ {error}
            </p>
          )}
          {success && (
            <p style={{ color: '#16a34a', fontSize: '0.875rem', padding: '0.6rem 0.875rem', background: '#dcfce7', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} /> {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.8rem', background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1a5f9c, #2e80cc)',
              color: '#fff', border: 'none', borderRadius: '0.625rem', fontWeight: 700,
              fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> جارٍ الحفظ...</> : 'حفظ التغييرات'}
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
