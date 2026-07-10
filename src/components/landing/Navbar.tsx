'use client';

import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  logoUrl: string;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-sm shadow-blue-900/10 border-b border-gray-100">
      <div className="app-container h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group" aria-label="ABD — الرئيسية">
          <Image
            src={logoUrl}
            alt="ABD — اي بي دي"
            width={160}
            height={54}
            priority
            className="object-contain h-12 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Single CTA */}
        <button
          onClick={scrollToForm}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-none font-tajawal"
        >
          تحقق من أهليتك
        </button>
      </div>
    </header>
  );
}
