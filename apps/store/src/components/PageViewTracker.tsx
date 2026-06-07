'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';

export function PageViewTracker() {
  const pathname = usePathname();
  const record = trpc.recordPageView.useMutation();
  const lastPath = useRef('');

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    record.mutate(
      { path: pathname, referrer: document.referrer || undefined },
      { onError: () => {} },
    );
  }, [pathname, record]);

  return null;
}
