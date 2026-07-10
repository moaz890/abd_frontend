'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '@/lib/types';

interface FaqProps {
  faqs: FaqItem[];
}

function FAQItem({
  q, a, open, onToggle,
}: {
  q: string; a: string; open: boolean; onToggle: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 ${
        open ? 'border-blue-200 shadow-md shadow-blue-50' : 'border-gray-100 shadow-sm'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right bg-transparent border-none cursor-pointer font-tajawal"
        aria-expanded={open}
      >
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 text-blue-600 transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />
        <span className="flex-1 font-bold text-gray-900 text-base md:text-lg leading-snug">
          {q}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-100 mx-6" />
        <p className="px-6 py-5 text-blue-700/80 text-sm md:text-base leading-relaxed text-right">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function Faq({ faqs }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sorted = [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="app-container">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            الأسئلة الشائعة
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            عندك سؤال؟{' '}
            <span className="bg-gradient-to-l from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
              عندنا الجواب
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            إجابات على أكثر الأسئلة اللي يسألها عملاؤنا
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {sorted.map((item, i) => (
            <FAQItem
              key={item.id}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
