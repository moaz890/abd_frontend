'use client';

import { useRef, useState, useEffect } from 'react';
import { TestimonialItem } from '@/lib/types';

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-indigo-500', 'bg-blue-800', 'bg-sky-600', 'bg-blue-500',
];

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-label="Google">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`تقييم ${count} من 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-5 h-5 ${i < count ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0" aria-label="تم التحقق">
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

const CHAR_LIMIT = 110;

function TestimonialCard({
  name, text, rating, monthsAgo, avatarColor, avatarUrl,
}: {
  name: string; text: string; rating: number; monthsAgo: number;
  avatarColor: string; avatarUrl?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CHAR_LIMIT;
  const displayText = expanded || !isLong ? text : text.slice(0, CHAR_LIMIT) + '...';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="h-full bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={name} className="w-11 h-11 rounded-full flex-shrink-0 object-cover border border-gray-200" />
          ) : (
            <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg select-none ${avatarColor}`}>
              {initial}
            </div>
          )}
          <div className="text-right">
            <p className="font-bold text-gray-900 text-sm leading-snug">{name}</p>
            <p className="text-gray-400 text-xs mt-0.5">{monthsAgo} أشهر مضى</p>
          </div>
        </div>
        <div className="flex-shrink-0 mt-0.5"><GoogleIcon /></div>
      </div>

      <div className="flex items-center gap-2">
        <Stars count={rating} />
        <VerifiedBadge />
      </div>

      <p className="text-gray-700 text-sm leading-relaxed text-right flex-1">{displayText}</p>

      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-blue-600 hover:text-blue-800 text-xs font-semibold text-right transition-colors bg-transparent border-none cursor-pointer font-tajawal"
        >
          {expanded ? 'اعرض أقل' : 'اعرض المزيد'}
        </button>
      )}
    </div>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const sorted = [...testimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const scrollToCard = (index: number) => {
    const card = cardRefs.current[index];
    if (!card || !scrollRef.current) return;
    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    container.scrollBy({ left: cardRect.left - containerRect.left, behavior: 'smooth' });
    setActiveIndex(index);
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { root: scrollRef.current, threshold: 0.6 }
      );
      obs.observe(card);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sorted.length]);

  return (
    <section id="testimonials" className="py-20 bg-slate-900 overflow-hidden">
      <div className="app-container">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-l from-blue-300 via-blue-200 to-white bg-clip-text text-transparent">
            وش قالو عن ABD
          </h2>
          <p className="text-blue-200/70 text-lg max-w-xl mx-auto">
            ثقة من اشترى وقسّط معنا هو سر نجاحنا — شاركنا تجربتكم
          </p>
        </div>

        {/* Horizontal scroll with snap */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide items-stretch pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {sorted.map((t, i) => (
            <div
              key={t.id ?? i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="flex-shrink-0 flex flex-col"
              style={{ width: 'calc(33.333% - 0.667rem)', minWidth: '260px', scrollSnapAlign: 'start' }}
            >
              <TestimonialCard
                name={t.name}
                text={t.text}
                rating={t.rating ?? 5}
                monthsAgo={t.monthsAgo ?? 1}
                avatarColor={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                avatarUrl={t.avatar_url}
              />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {sorted.map((_, i) => (
            <button
              key={i}
              aria-label={`انتقل للتقييم ${i + 1}`}
              onClick={() => scrollToCard(i)}
              className={`rounded-full transition-all duration-300 border-none cursor-pointer ${
                activeIndex === i
                  ? 'w-6 h-2.5 bg-blue-400'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
