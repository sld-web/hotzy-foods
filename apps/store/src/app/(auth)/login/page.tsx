'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useCustomerAuth } from '@/lib/customer-auth-store';
import { Button, Input } from '@hotzy/ui';
import { useToast } from '@hotzy/ui';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setAuth, isAuthenticated } = useCustomerAuth();
  const { toast } = useToast();

  const loginMutation = trpc.customerAuth.login.useMutation({
    onSuccess: (data) => {
      setAuth(data.token, data.customer);
      toast('Welcome back!', 'success');
      router.push('/');
    },
    onError: (err) => {
      toast(err.message || 'Login failed', 'error');
    },
  });

  const registerMutation = trpc.customerAuth.register.useMutation({
    onSuccess: (data) => {
      setAuth(data.token, data.customer);
      toast('Account created!', 'success');
      router.push('/');
    },
    onError: (err) => {
      toast(err.message || 'Registration failed', 'error');
    },
  });

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please fill in all fields', 'error');
      return;
    }
    if (isLogin) {
      loginMutation.mutate({ email, password });
    } else {
      if (!name) {
        toast('Please enter your name', 'error');
        return;
      }
      if (password.length < 6) {
        toast('Password must be at least 6 characters', 'error');
        return;
      }
      registerMutation.mutate({ email, password, name });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-headline-lg text-on-surface mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            {isLogin
              ? 'Sign in to track your orders'
              : 'Create an account to track orders and more'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-surface-container p-6 space-y-4"
        >
          {!isLogin && (
            <Input
              label="Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          )}
          <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            className="w-full"
            loading={loginMutation.isPending || registerMutation.isPending}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>

          <p className="text-center text-label-sm text-on-surface-variant">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary font-semibold"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary font-semibold"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
