import { SITE_NAME } from '@/lib/constants';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-surface-container py-stack-lg">
      <div className="max-w-container mx-auto px-4 md:px-margin-desktop">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-headline-md text-primary mb-3">{SITE_NAME}</h3>
            <p className="text-body-md text-on-surface-variant">Bold Flavor. Zero Limits.</p>
          </div>
          <div>
            <h4 className="text-label-md font-semibold text-on-surface mb-3">Support</h4>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary">
                Terms & Conditions
              </Link>
              <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary">
                Refund & Return Policy
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-label-md font-semibold text-on-surface mb-3">Contact Us</h4>
            <p className="text-body-md text-on-surface-variant">Hotline: (+94) 76 330 53 88</p>
            <p className="text-body-md text-on-surface-variant">Email: info@hotzyfoods.com</p>
            <p className="text-body-md text-on-surface-variant">WhatsApp: (+94) 710 566 570</p>
          </div>
        </div>
        <div className="border-t border-surface-container pt-4 text-center text-label-sm text-on-surface-variant">
          <p>2026, ZEST LANKA INTERNATIONAL (PRIVATE) LIMITED</p>
        </div>
      </div>
    </footer>
  );
}
