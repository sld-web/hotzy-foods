'use client';

export default function ShopError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-4">
        <span className="material-symbols-outlined text-6xl text-primary mb-4 block">error</span>
        <h1 className="text-headline-md text-on-surface mb-2">Something went wrong</h1>
        <p className="text-body-md text-on-surface-variant mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-[#92001f] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
