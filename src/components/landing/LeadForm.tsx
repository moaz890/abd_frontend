import { LeadFormSectionContent } from '@/lib/types';
import { phoneToWA } from '@/lib/auth';
import { MessageCircle } from 'lucide-react';

interface LeadFormProps {
  section: LeadFormSectionContent;
  whatsapp: string;
  whatsappMessage?: string;
}

export default function LeadForm({ section, whatsapp, whatsappMessage }: LeadFormProps) {
  const waUrl = phoneToWA(
    whatsapp,
    whatsappMessage ?? 'مرحباً، أريد التحقق من أهليتي لعروض ABD'
  );

  return (
    <section
      id="lead-form"
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-padding-y)',
      }}
    >
      <div className="app-container" style={{ maxWidth: '680px' }}>
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {section.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            {section.title}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        <div
          className="card text-center"
          style={{ padding: '3rem 2.5rem', borderRadius: 'var(--radius-lg)' }}
        >
          <p
            className="text-gray-600 text-base leading-relaxed mb-8 max-w-md mx-auto"
          >
            {section.consentText}
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-white text-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: '#25D366',
              boxShadow: '0 8px 24px rgba(37,211,102,0.35)',
            }}
          >
            <MessageCircle size={24} />
            تحقق من اهليتك
          </a>
        </div>
      </div>
    </section>
  );
}
