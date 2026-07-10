import type { Metadata } from 'next';
// Self-hosted Tajawal — no Google Fonts network call at build time
import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/tajawal/800.css';
import '@fontsource/tajawal/900.css';
import './globals.css';

// ── Default metadata (overridden per-page via generateMetadata) ────────────────
export const metadata: Metadata = {
  title: 'ABD — اي بي دي | هواتف ذكية وتقسيط مرن',
  description: 'احصل على أحدث الهواتف الذكية بتقسيط مرن وبدون تعقيدات مع ABD — اي بي دي',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
