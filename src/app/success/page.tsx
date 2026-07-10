import type { Metadata } from 'next';
import { fetchSiteContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'تم التقديم بنجاح — ABD اي بي دي',
};

export default async function SuccessPage() {
  const content = await fetchSiteContent();
  const sp = content.successPage;
  const footer = content.footer;

  const rawWaNumber = sp?.whatsapp || footer?.whatsapp || '966500000000';
  const waNumber = rawWaNumber.replace(/\D/g, '');
  const waMessage = encodeURIComponent(sp?.whatsappMessage ?? 'مرحباً، أنا مهتم بعروض ABD');
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #0d3d6b 0%, #1a5f9c 50%, #2e80cc 100%)',
        padding: '2rem',
        fontFamily: 'var(--font-tajawal)',
        direction: 'rtl',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '3rem 3.5rem',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        {/* Checkmark */}
        <div
          style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.2)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 1.5rem',
            animation: 'scaleIn 0.5s ease',
          }}
        >
          ✅
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '0.75rem',
            lineHeight: 1.2,
          }}
        >
          {sp?.title ?? 'تم التقديم بنجاح!'}
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1rem',
            lineHeight: 1.8,
            marginBottom: '2rem',
          }}
        >
          {sp?.subtitle ??
            'شكراً لتقديمك. سيتواصل معك فريقنا في أقرب وقت ممكن.'}
        </p>

        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#25d366',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.85rem 2rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
              transition: 'transform 0.2s ease',
              fontFamily: 'inherit',
            }}
          >
            💬 تواصل عبر واتساب
          </a>
        )}

        <div style={{ marginTop: '2rem' }}>
          <a
            href="/"
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            ← العودة للرئيسية
          </a>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </main>
  );
}
