/**
 * lib/auth.ts — client-side auth helpers + utility functions.
 * Phase 16.
 */

const TOKEN_KEY = 'abd_token';

// ── Token helpers ─────────────────────────────────────────────────────────────
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

// ── WhatsApp deep-link ────────────────────────────────────────────────────────
/**
 * Build a wa.me link.
 * @param phone  digits only, no + (e.g. "966500000000")
 * @param message  pre-filled message (optional)
 */
export function phoneToWA(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const base   = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

// ── Date formatting (Arabic-aware) ────────────────────────────────────────────
export function formatDateAr(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-SA', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  });
}

// ── Lead status label map ─────────────────────────────────────────────────────
export const STATUS_LABELS: Record<string, string> = {
  new:       'جديد',
  contacted: 'تم التواصل',
  closed:    'مغلق',
};

export const STATUS_COLORS: Record<string, string> = {
  new:       '#3b82f6',  // blue
  contacted: '#f59e0b',  // amber
  closed:    '#10b981',  // green
};
