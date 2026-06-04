'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuthStore } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = trpc.admin.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('hotzy-admin-token', data.token);
      setAuth(data.token, data.user);
      router.push('/admin');
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    if (token) router.push('/admin');
  }, [token, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-headline-lg text-primary mb-2">Hotzy Foods</h1>
          <p className="text-body-md text-on-surface-variant">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-error/10 text-error text-label-sm">{error}</div>
          )}

          {loginMutation.isSuccess && (
            <div className="p-3 rounded-lg bg-fresh-mint/10 text-tertiary text-label-sm">
              Login successful! Redirecting...
            </div>
          )}

          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="admin@hotzyfoods.com"
              required
            />
          </div>

          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-white text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-2.5 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-[#92001f] transition-colors disabled:opacity-50"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
