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
  const body = await request.json().catch(() => ({}));
  const secret = body.secret ?? request.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
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
