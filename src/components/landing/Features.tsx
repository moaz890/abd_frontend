import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { FeaturesContent } from '@/lib/types';

interface FeaturesProps {
  features: FeaturesContent;
}

function FeatureCard({
  imageUrl,
  heading,
  paragraph,
}: {
  imageUrl: string;
  heading: string;
  paragraph: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 p-8 flex flex-col items-center text-center gap-5">
      <div className="w-28 h-28 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        <Image
          src={imageUrl}
          alt={heading}
          width={100}
          height={100}
          className="object-contain w-20 h-20"
        />
      </div>
      <h3 className="text-xl font-black text-gray-900 leading-snug">{heading}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{paragraph}</p>
    </div>
  );
}

export default function Features({ features }: FeaturesProps) {
  const { shopPromo } = features;

  return (
    <section id="features" className="py-20 bg-white">
      <div className="app-container">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {features.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            {features.title}{' '}
            <span className="bg-gradient-to-l from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
              {features.titleHighlight}
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{features.subtitle}</p>
        </div>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.items.map((f) => (
            <FeatureCard
              key={f.id}
              imageUrl={f.imageUrl}
              heading={f.heading}
              paragraph={f.paragraph}
            />
          ))}
        </div>

        {/* Shop promo */}
        {shopPromo && (
          <div className="mt-20 flex flex-col items-center text-center gap-8">
            {/* Full-width image */}
            <div className="w-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10">
              <Image
                src={shopPromo.imageUrl}
                alt={shopPromo.imageAlt}
                width={1280}
                height={600}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-contain w-full h-auto"
              />
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-snug max-w-2xl">
              {shopPromo.heading}
            </h2>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-xl">
              {shopPromo.subtextBefore}{' '}
              <span className="text-blue-600 font-bold">{shopPromo.subtextHighlight}</span>
              {' '}{shopPromo.subtextAfter}
            </p>

            {/* BNPL partner buttons */}
            <div className="flex flex-wrap justify-center gap-5">
              <a
                href={shopPromo.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-12 py-4 rounded-xl min-w-[180px] hover:opacity-90 hover:scale-105 transition-all duration-200"
                style={{ background: '#3DBDA7' }}
              >
                <span className="text-white font-bold text-3xl tracking-tight" style={{ fontFamily: 'sans-serif' }}>
                  tabby
                </span>
              </a>
              <a
                href={shopPromo.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-12 py-4 rounded-xl min-w-[180px] hover:opacity-90 hover:scale-105 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #F5A623 0%, #F76D57 100%)' }}
              >
                <span className="text-white font-bold text-3xl tracking-tight" style={{ fontFamily: 'sans-serif' }}>
                  tamara
                </span>
              </a>
            </div>

            <a
              id="shop-now-btn"
              href={shopPromo.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {shopPromo.ctaText}
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
