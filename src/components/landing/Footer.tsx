import Image from 'next/image';
import Link from 'next/link';
import { FooterContent } from '@/lib/types';

interface FooterProps {
  footer: FooterContent;
  logoUrl: string;
}

const YEAR = new Date().getFullYear();

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.118 1.528 5.845L.057 23.43a.5.5 0 0 0 .608.61l5.7-1.484A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.83 9.83 0 0 1-5.032-1.382l-.36-.214-3.733.972.995-3.63-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
    </svg>
  );
}

function SnapchatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12.017 0C8.396 0 7.207.006 6.105.058 3.92.159 2.217.94 1.087 2.087.934 2.24.79 2.395.657 2.557a5.12 5.12 0 0 0-.599 3.548C.006 7.207 0 8.396 0 12.017c0 3.621.006 4.81.058 5.912.1 2.185.883 3.888 2.03 5.018C3.213 24.06 4.913 24.841 7.1 24.942 8.2 24.994 9.39 25 13.01 25s4.81-.006 5.912-.058c2.188-.1 3.891-.883 5.021-2.013C25.073 21.8 25.855 20.1 25.955 17.912 26.007 16.81 26 15.62 26 12.017c0-3.62-.006-4.81-.058-5.912-.1-2.188-.883-3.891-2.013-5.021C22.8.954 21.1.172 18.912.072 17.81.02 16.62 0 12.017 0z" />
    </svg>
  );
}

export default function Footer({ footer, logoUrl }: FooterProps) {
  const socials = [
    footer.whatsapp && { label: 'واتساب', href: `https://wa.me/${footer.whatsapp.replace(/\D/g, '')}`, icon: <WhatsAppIcon />, bg: 'hover:bg-[#25D366]' },
    footer.tiktok   && { label: 'تيك توك', href: footer.tiktok, icon: <TikTokIcon />, bg: 'hover:bg-gray-900' },
    footer.snapchat && { label: 'سناب شات', href: footer.snapchat, icon: <SnapchatIcon />, bg: 'hover:bg-yellow-400' },
    footer.email    && {
      label: 'البريد الإلكتروني', href: `mailto:${footer.email}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'hover:bg-blue-600',
    },
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode; bg: string }[];

  return (
    <footer id="footer" className="bg-gray-950 text-white pt-16 pb-8">
      <div className="app-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">

          {/* Brand column */}
          <div className="text-right">
            <h3 className="text-lg font-bold text-white mb-4 after:block after:w-10 after:h-0.5 after:bg-blue-500 after:mt-2 after:mr-auto">
              من نحن
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              ABD — اي بي دي علامة تجارية سعودية متخصصة في بيع الهواتف الذكية والأجهزة الإلكترونية بتقسيط مرن يناسب الجميع.
            </p>
            <div className="mt-6">
              <Image
                src={logoUrl}
                alt="ABD — اي بي دي"
                width={120}
                height={50}
                className="object-contain"
              />
            </div>
          </div>

          {/* Map column */}
          <div className="text-right">
            <h3 className="text-lg font-bold text-white mb-4 after:block after:w-10 after:h-0.5 after:bg-blue-500 after:mt-2 after:mr-auto">
              موقعنا
            </h3>
            {footer.mapsEmbedUrl && (
              <>
                <div className="w-full rounded-xl overflow-hidden border border-white/10 h-56">
                  <iframe
                    title="موقع ABD"
                    src={footer.mapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                {footer.mapsExternalUrl && (
                  <a
                    href={footer.mapsExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs mt-2 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                    </svg>
                    افتح في خرائط Google
                  </a>
                )}
              </>
            )}
          </div>

          {/* Contact column */}
          <div className="text-right">
            <h3 className="text-lg font-bold text-white mb-4 after:block after:w-10 after:h-0.5 after:bg-blue-500 after:mt-2 after:mr-auto">
              تواصل معنا
            </h3>
            <div className="space-y-3 text-sm">
              {footer.taxNumber && (
                <div className="flex items-center justify-end gap-3">
                  <span className="text-gray-400">الرقم الضريبي: <span className="text-gray-200 font-mono">{footer.taxNumber}</span></span>
                </div>
              )}
              {footer.businessCenterNumber && (
                <div className="flex items-center justify-end gap-3">
                  <span className="text-gray-400">مركز الأعمال: <span className="text-gray-200 font-mono">{footer.businessCenterNumber}</span></span>
                </div>
              )}
              {footer.crNumber && (
                <div className="flex items-center justify-end gap-3">
                  <span className="text-gray-400">السجل التجاري: <span className="text-gray-200 font-mono">{footer.crNumber}</span></span>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-400">
              {footer.whatsapp && (
                <a href={`https://wa.me/${footer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-end gap-2 hover:text-green-400 transition-colors">
                  <span>راسلنا عن طريق الواتساب</span>
                  <span className="text-green-500">●</span>
                </a>
              )}
              {footer.email && (
                <a href={`mailto:${footer.email}`}
                  className="flex items-center justify-end gap-2 hover:text-blue-400 transition-colors">
                  <span>راسلنا عن طريق الإيميل</span>
                  <span className="text-blue-500">●</span>
                </a>
              )}
            </div>
            {/* Social icons */}
            <div className="flex flex-wrap gap-3 mt-6 justify-end">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white ${s.bg} transition-all duration-200 hover:scale-110`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 text-center">
            <p>© {YEAR} {footer.copyrightText}</p>
            <p>
              <Link href="/dashboard/login" className="hover:text-gray-300 transition-colors">
                لوحة التحكم
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
