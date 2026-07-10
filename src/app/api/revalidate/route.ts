/**
 * app/api/revalidate/route.ts
 *
 * On-demand cache bust called by dashboard after a CMS save.
 * Revalidates the '/' and '/success' pages so the landing reflects
 * new content within seconds instead of waiting for ISR's 60s window.
 *
 * Security: requires matching REVALIDATE_SECRET header.
 * Phase 17.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');
  const auth = request.headers.get('authorization');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

  let authorized = false;

  if (process.env.REVALIDATE_SECRET && secret === process.env.REVALIDATE_SECRET) {
    authorized = true;
  }

  if (!authorized && auth?.startsWith('Bearer ')) {
    try {
      const me = await fetch(`${apiUrl}/api/auth/me`, {
        headers: { Authorization: auth },
        cache: 'no-store',
      });
      if (me.ok) {
        const json = await me.json();
        // Backend returns success: true or similar
        authorized = json?.success === true || !!json?.admin;
      }
    } catch (err) {
      console.warn('[revalidate] Auth verification call failed:', err);
      authorized = false;
    }
  }

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    revalidateTag('site-content');
    revalidatePath('/');
    revalidatePath('/success');

    return NextResponse.json({
      revalidated: true,
      message: 'Cache cleared for / and /success',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
