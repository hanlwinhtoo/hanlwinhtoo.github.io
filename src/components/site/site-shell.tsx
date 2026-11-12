import type {ReactNode} from 'react';
import {SodiumPortalProvider} from '@/lib/sodium/portal';
import {CursorFollower} from '@/components/site/cursor-follower';

/**
 * Sodium's page shell. <body> carries the "sodium" class (see the HTML entry files);
 * this root fills the page and keeps overlays inside the scope. It also mounts the cursor's following square.
 */
export function SiteShell({children}: {children: ReactNode}) {
  return <div id="top" className="min-h-dvh bg-page text-text-1">
    <SodiumPortalProvider>{children}</SodiumPortalProvider>
    <CursorFollower/>
  </div>;
}
