import { redirect } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Auth check will be done client-side
  return <>{children}</>;
}
