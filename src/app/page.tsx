import type { Metadata } from 'next';
import { fetchSiteContent } from '@/lib/content';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import LeadForm from '@/components/landing/LeadForm';
import Testimonials from '@/components/landing/Testimonials';
import Features from '@/components/landing/Features';
import Faq from '@/components/landing/Faq';
import Footer from '@/components/landing/Footer';

// ── ISR metadata from CMS ──────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchSiteContent();
  return {
    title: content.seo?.title ?? 'ABD — اي بي دي | هواتف ذكية وتقسيط مرن',
    description: content.seo?.description ?? 'احصل على أحدث الهواتف الذكية بتقسيط مرن مع ABD',
    openGraph: {
      title: content.seo?.ogTitle ?? content.seo?.title,
      description: content.seo?.ogDescription ?? content.seo?.description,
    },
  };
}

// ── Landing page — single CMS fetch, props drilled to each component ──────────
export default async function HomePage() {
  const content = await fetchSiteContent();

  return (
    <>
      <Navbar logoUrl={content.logoUrl} />

      <main>
        <Hero hero={content.hero} />

        <LeadForm
          section={content.leadFormSection}
          whatsapp={content.footer?.whatsapp ?? content.successPage?.whatsapp ?? '966500000000'}
          whatsappMessage={content.successPage?.whatsappMessage}
        />

        <Testimonials testimonials={content.testimonials} />

        <Features features={content.features} />

        <Faq faqs={content.faqs} />
      </main>

      <Footer footer={content.footer} logoUrl={content.logoUrl} />
    </>
  );
}
