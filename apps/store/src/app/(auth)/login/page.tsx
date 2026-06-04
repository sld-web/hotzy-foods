'use client';

import { useState } from 'react';
import { Button, Input } from '@hotzy/ui';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-headline-lg text-on-surface mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-body-md text-on-surface-variant">
            {isLogin ? 'Sign in to track your orders' : 'Create an account to track orders and more'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
          {!isLogin && <Input label="Name" id="name" placeholder="Your name" />}
          <Input label="Email" id="email" type="email" placeholder="you@example.com" />
          <Input label="Password" id="password" type="password" placeholder="••••••••" />

          <Button className="w-full">{isLogin ? 'Sign In' : 'Create Account'}</Button>

          <p className="text-center text-label-sm text-on-surface-variant">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="text-primary font-semibold">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-primary font-semibold">
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
