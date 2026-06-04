'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('hotzy-admin-token');
    if (token) router.push('/admin');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, redirect to admin (token-based auth will be implemented fully)
      localStorage.setItem('hotzy-admin-token', 'mock-token');
      router.push('/admin');
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-[#92001f] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
