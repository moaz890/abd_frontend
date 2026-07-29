'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { trackSnapEvent } from '@/lib/snapchat';

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  snapEvent: string;
  snapEventData?: Record<string, unknown>;
}

export default function TrackedLink({
  snapEvent,
  snapEventData,
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackSnapEvent(snapEvent, snapEventData);
    onClick?.(event);
  };

  return <a {...props} onClick={handleClick} />;
}
