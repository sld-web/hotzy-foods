'use client';

import { Button } from '@hotzy/ui';

export default function WebsitePage() {
  return (
    <div>
      <h1 className="text-headline-lg text-on-surface mb-6">Website Customization</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
          <h2 className="text-headline-md text-on-surface">Brand Assets</h2>
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">image</span>
            <p className="text-label-sm text-on-surface-variant mt-2">Upload logo</p>
          </div>
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">image</span>
            <p className="text-label-sm text-on-surface-variant mt-2">Upload favicon</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-container p-6 space-y-4">
          <h2 className="text-headline-md text-on-surface">Homepage Banners</h2>
          {['Hero Banner', 'Featured Category 1', 'Featured Category 2'].map((banner) => (
            <div key={banner} className="flex items-center justify-between p-3 rounded-lg border border-surface-container">
              <div>
                <p className="text-body-md text-on-surface">{banner}</p>
                <p className="text-label-sm text-on-surface-variant">Live</p>
              </div>
              <button className="text-primary material-symbols-outlined">edit</button>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            Add Banner
          </Button>
        </div>
      </div>
    </div>
  );
}
