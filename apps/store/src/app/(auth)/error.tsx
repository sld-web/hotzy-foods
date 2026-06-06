'use client';

export default function AuthError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-md px-4">
        <h1 className="text-headline-md text-on-surface mb-2">Something went wrong</h1>
        <p className="text-body-md text-on-surface-variant mb-6">{error.message}</p>
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
