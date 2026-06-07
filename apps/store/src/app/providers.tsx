'use client';

import { TRPCProvider } from '@/providers/trpc-provider';
import { ToastProvider } from '@hotzy/ui';
import { PageViewTracker } from '@/components/PageViewTracker';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ToastProvider>
        {children}
        <PageViewTracker />
      </ToastProvider>
    </TRPCProvider>
  );
}
