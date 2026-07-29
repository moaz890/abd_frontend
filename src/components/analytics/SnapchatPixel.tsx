'use client';

import Script from 'next/script';
import { SNAPCHAT_PIXEL_ID } from '@/lib/snapchatEvents';

const SNAPCHAT_PIXEL_SCRIPT = `
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
{a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
r.src=n;var u=t.getElementsByTagName(s)[0];
u.parentNode.insertBefore(r,u);})(window,document,
'https://sc-static.net/scevent.min.js');

snaptr('init', '${SNAPCHAT_PIXEL_ID}');
snaptr('track', 'PAGE_VIEW');
`;

export default function SnapchatPixel() {
  return (
    <Script
      id="snapchat-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: SNAPCHAT_PIXEL_SCRIPT }}
    />
  );
}
