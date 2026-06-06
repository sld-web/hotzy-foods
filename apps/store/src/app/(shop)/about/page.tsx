'use client';

import { trpc } from '@/lib/trpc';

export default function AboutPage() {
  const { data: team } = trpc.team.list.useQuery();
  const { data: settings } = trpc.settings.get.useQuery();

  const heatLevels = [
    { name: 'Mild', shu: '1k - 5k', desc: 'Flavor forward, polite warmth' },
    { name: 'Medium', shu: '10k - 30k', desc: 'Confident kick, everyday bold' },
    { name: 'Hot', shu: '50k - 100k', desc: 'Serious heat, sweaty brows' },
    { name: 'Xtreme Heat', shu: '500k+', desc: 'Proceed with caution' },
  ];

  return (
    <div className="max-w-container mx-auto px-4 md:px-margin-desktop py-stack-lg">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-display-mobile md:text-display-lg text-on-surface mb-4">Our Story</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Born in Sri Lanka in 2022, Hotzy Foods was founded by Amali and Chamath with a mission to
          bring bold Sri Lankan flavors to the world.
        </p>
      </section>

      {/* Journey Timeline */}
      <section className="mb-16">
        <h2 className="text-headline-lg text-on-surface mb-6">Our Journey</h2>
        <div className="space-y-4">
          {[
            {
              year: '2022',
              text: 'Founded by Amali & Chamath during Sri Lanka economic crisis. Built our own polytunnel to grow Scotch Bonnet peppers.',
            },
            {
              year: '2023',
              text: 'Launched Snake Bite (pineapple-based hot sauce). Went viral on TikTok. First export order to Australia.',
            },
            {
              year: '2024',
              text: 'Expanded product line. Won Best National Industry Brand 2024 and NEDA Bronze Award. Achieved ISO 22000:2018 certification.',
            },
            {
              year: '2025',
              text: 'Launched jams, Asian sauces, and gift packs. Growing export markets.',
            },
          ].map((item) => (
            <div
              key={item.year}
              className="flex gap-4 p-4 bg-white rounded-xl border border-surface-container"
            >
              <span className="text-label-sm text-primary font-bold shrink-0 w-12">
                {item.year}
              </span>
              <p className="text-body-md text-on-surface-variant">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Heat Scale */}
      <section className="mb-16">
        <h2 className="text-headline-lg text-on-surface mb-6">Our Heat Scale</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {heatLevels.map((level) => (
            <div
              key={level.name}
              className="bg-white rounded-xl border border-surface-container p-5 text-center"
            >
              <h3 className="text-headline-md text-primary mb-2">{level.name}</h3>
              <p className="text-label-sm text-on-surface-variant mb-1">{level.shu} SHU</p>
              <p className="text-body-md text-on-surface-variant">{level.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      {team && team.length > 0 && (
        <section className="mb-16">
          <h2 className="text-headline-lg text-on-surface mb-6">Meet the Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {team.map(
              (member: {
                id: string;
                name: string;
                role: string;
                photoUrl: string | null;
                bio: string | null;
              }) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl border border-surface-container p-6 flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-surface-gray flex items-center justify-center shrink-0 overflow-hidden">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                        person
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-body-md font-semibold text-on-surface">{member.name}</h3>
                    <p className="text-label-sm text-on-surface-variant">{member.role}</p>
                    {member.bio && (
                      <p className="text-body-sm text-on-surface-variant mt-1">{member.bio}</p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {/* Mission */}
      <section className="text-center py-stack-lg bg-primary/5 rounded-xl p-8">
        <h2 className="text-headline-lg text-on-surface mb-3">Our Mission</h2>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {settings?.tagline ||
            'Hotzy is more than a product — it is a shared love for spice, flavor and life.'}
        </p>
      </section>
    </div>
  );
}
