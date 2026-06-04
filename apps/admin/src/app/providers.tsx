'use client';

import { TRPCProvider } from '@/providers/trpc-provider';
import { ToastProvider } from '@hotzy/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <ToastProvider>{children}</ToastProvider>
    </TRPCProvider>
  );
}
