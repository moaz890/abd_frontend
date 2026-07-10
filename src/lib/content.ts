/**
 * lib/content.ts — CMS fetch layer.
 *
 * fetchSiteContent():
 *   - Server Component fetch with ISR (revalidate: 60s, tag: 'site-content')
 *   - deepMerge(DEFAULT_SITE_CONTENT, apiData) so missing fields always fallback
 *   - Returns DEFAULT_SITE_CONTENT if API is unreachable (offline-safe)
 *
 * Phase 17.
 */

import type { SiteContent } from './types';
import { DEFAULT_SITE_CONTENT } from './contentDefaults';

// ── Deep merge helper ─────────────────────────────────────────────────────────
function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result: Record<string, unknown> = { ...base };

  for (const key of Object.keys(override)) {
    const baseVal     = base[key];
    const overrideVal = override[key as keyof T];

    if (isObject(baseVal) && isObject(overrideVal)) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>
      );
    } else if (overrideVal !== undefined && overrideVal !== null) {
      result[key] = overrideVal;
    }
  }

  return result as T;
}

// ── fetchSiteContent ──────────────────────────────────────────────────────────
export async function fetchSiteContent(): Promise<SiteContent> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

  try {
    const res = await fetch(`${apiUrl}/api/content`, {
      next: { revalidate: 60, tags: ['site-content'] },
    });

    if (!res.ok) {
      console.warn(`[fetchSiteContent] API returned ${res.status} — using defaults`);
      return DEFAULT_SITE_CONTENT;
    }

    const apiData: Partial<SiteContent> = await res.json();

    // Merge API data over defaults so any missing field stays populated
    return deepMerge(DEFAULT_SITE_CONTENT as unknown as Record<string, unknown>, apiData as unknown as Record<string, unknown>) as unknown as SiteContent;
  } catch (err) {
    console.warn('[fetchSiteContent] API unreachable — using defaults:', err);
    return DEFAULT_SITE_CONTENT;
  }
}
