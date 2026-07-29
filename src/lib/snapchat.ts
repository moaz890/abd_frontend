import type { Snaptr } from '@/types/snapchat';

declare global {
  interface Window {
    snaptr?: Snaptr;
  }
}

/**
 * Fire a Snapchat Pixel event safely from client components.
 * No-ops during SSR or when the pixel has not loaded yet.
 */
export function trackSnapEvent(
  eventName: string,
  eventData?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;

  const snaptr = window.snaptr;
  if (typeof snaptr !== 'function') return;

  try {
    if (eventData !== undefined) {
      snaptr('track', eventName, eventData);
    } else {
      snaptr('track', eventName);
    }
  } catch {
    // Pixel failures must not break user interactions.
  }
}
