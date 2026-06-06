import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-display-mobile md:text-display-lg text-primary font-extrabold mb-2">
          404
        </h1>
        <p className="text-headline-md text-on-surface mb-4">Page Not Found</p>
        <p className="text-body-md text-on-surface-variant mb-8">
          Looks like this page got lost in the sauce. Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-[#92001f] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
