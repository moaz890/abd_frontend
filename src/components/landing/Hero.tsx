'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { HeroContent } from '@/lib/types';

interface HeroProps {
  hero: HeroContent;
}

export default function Hero({ hero }: HeroProps) {
  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image + overlays */}
      <div className="absolute inset-0">
        <Image
          src={hero.imageUrl}
          alt={hero.titleLine1}
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" style={{ zIndex: 1 }} />
        <div className="absolute inset-0 bg-blue-950/20" style={{ zIndex: 1 }} />
      </div>

      {/* Content */}
      <div className="app-container relative text-white z-10 text-center mt-20">

        {/* Badge */}
        <div className="hero-anim-1 inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse inline-block" />
          {hero.badge}
        </div>

        {/* Title */}
        <h1 className="hero-anim-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
          <span className="bg-gradient-to-l from-blue-300 via-blue-200 to-white bg-clip-text text-transparent">
            {hero.titleLine1}
          </span>
          <br />
          <span className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
            {hero.titleLine2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-anim-3 text-lg sm:text-xl md:text-2xl text-blue-100/90 font-light leading-relaxed mb-10 max-w-3xl mx-auto">
          {hero.subtitle}
        </p>

        {/* CTA */}
        <div className="hero-anim-4">
          <button
            id="hero-cta-btn"
            onClick={scrollToForm}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold shadow-2xl shadow-blue-900/40 hover:shadow-blue-500/40 border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden cursor-pointer font-tajawal"
          >
            <span className="absolute inset-0 w-0 bg-white/20 group-hover:w-full transition-all duration-500 ease-out rounded-2xl" />
            <span className="relative">{hero.ctaText}</span>
            <ChevronDown className="relative w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Trust badges */}
        <div className="hero-anim-5 flex flex-wrap justify-center gap-4 mt-14">
          {hero.trustBadges.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2 rounded-full text-sm text-white/90"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bounce scroll arrow */}
      <button
        onClick={scrollToForm}
        aria-label="انزل للأسفل"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors duration-300 animate-bounce z-10 bg-transparent border-none cursor-pointer"
      >
        <ChevronDown className="w-8 h-8" />
      </button>

      <style>{`
        .hero-anim-1 { animation: heroFadeUp 0.6s ease 0.0s both; }
        .hero-anim-2 { animation: heroFadeUp 0.6s ease 0.15s both; }
        .hero-anim-3 { animation: heroFadeUp 0.6s ease 0.3s both; }
        .hero-anim-4 { animation: heroFadeUp 0.6s ease 0.45s both; }
        .hero-anim-5 { animation: heroFadeUp 0.6s ease 0.6s both; }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
