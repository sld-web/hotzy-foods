'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button, Input, Modal, ConfirmDialog } from '@hotzy/ui';

const PLACEMENTS = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'featured-1', label: 'Featured Category 1' },
  { value: 'featured-2', label: 'Featured Category 2' },
  { value: 'deals', label: 'Hot Deals' },
];

export default function WebsitePage() {
  const { data: settings, refetch: refetchSettings } = trpc.admin.settings.get.useQuery();
  const updateSettings = trpc.admin.settings.update.useMutation({
    onSuccess: () => refetchSettings(),
  });

  const { data: campaigns, refetch: refetchCampaigns } = trpc.admin.campaign.list.useQuery();
  const createCampaign = trpc.admin.campaign.create.useMutation({
    onSuccess: () => {
      setCampaignModal(false);
      refetchCampaigns();
    },
  });
  const updateCampaign = trpc.admin.campaign.update.useMutation({
    onSuccess: () => {
      setCampaignModal(false);
      refetchCampaigns();
    },
  });
  const deleteCampaign = trpc.admin.campaign.delete.useMutation({
    onSuccess: () => {
      setDeleteId(null);
      refetchCampaigns();
    },
  });

  const { data: team, refetch: refetchTeam } = trpc.admin.team.list.useQuery();
  const createTeam = trpc.admin.team.create.useMutation({
    onSuccess: () => {
      setTeamModal(false);
      refetchTeam();
    },
  });
  const deleteTeam = trpc.admin.team.delete.useMutation({
    onSuccess: () => {
      setDeleteId(null);
      refetchTeam();
    },
  });

  const [brandForm, setBrandForm] = useState<Record<string, string>>({});
  const [campaignModal, setCampaignModal] = useState(false);
  const [editCampaign, setEditCampaign] = useState<any>(null);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    placement: 'hero',
    sortOrder: 0,
  });
  const [teamModal, setTeamModal] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    bio: '',
    photoUrl: '',
    sortOrder: 0,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'campaign' | 'team'>('campaign');

  const loadBrand = () => {
    if (settings) {
      setBrandForm({
        brandName: settings.brandName,
        tagline: settings.tagline,
        logoUrl: settings.logoUrl ?? '',
        faviconUrl: settings.faviconUrl ?? '',
        contactEmail: settings.contactEmail ?? '',
        contactPhone: settings.contactPhone ?? '',
        contactWhatsApp: settings.contactWhatsApp ?? '',
        address: settings.address ?? '',
        shippingBase: String(settings.shippingBase),
        freeShippingThreshold: String(settings.freeShippingThreshold ?? ''),
        taxRate: String(settings.taxRate),
      });
    }
  };

  useEffect(() => {
    if (settings) loadBrand();
  }, [settings]);

  const saveBrand = () => {
    updateSettings.mutate({
      brandName: brandForm.brandName,
      tagline: brandForm.tagline,
      logoUrl: brandForm.logoUrl || undefined,
      faviconUrl: brandForm.faviconUrl || undefined,
      contactEmail: brandForm.contactEmail || undefined,
      contactPhone: brandForm.contactPhone || undefined,
      contactWhatsApp: brandForm.contactWhatsApp || undefined,
      address: brandForm.address || undefined,
      shippingBase: Number(brandForm.shippingBase) || 0,
      freeShippingThreshold: brandForm.freeShippingThreshold
        ? Number(brandForm.freeShippingThreshold)
        : undefined,
      taxRate: Number(brandForm.taxRate) || 0,
    });
  };

  const openCampaign = (c?: any) => {
    if (c) {
      setEditCampaign(c);
      setCampaignForm({
        title: c.title,
        description: c.description ?? '',
        imageUrl: c.imageUrl ?? '',
        linkUrl: c.linkUrl ?? '',
        placement: c.placement,
        sortOrder: c.sortOrder,
      });
    } else {
      setEditCampaign(null);
      setCampaignForm({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        placement: 'hero',
        sortOrder: 0,
      });
    }
    setCampaignModal(true);
  };

  const saveCampaign = () => {
    if (editCampaign) {
      updateCampaign.mutate({ id: editCampaign.id, ...campaignForm });
    } else {
      createCampaign.mutate(campaignForm);
    }
  };

  const openTeam = () => {
    setTeamForm({ name: '', role: '', bio: '', photoUrl: '', sortOrder: 0 });
    setTeamModal(true);
  };

  return (
    <div>
      <h1 className="text-headline-lg text-on-surface mb-6">Website Customization</h1>

      <div className="space-y-6">
        {/* Brand Settings */}
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <h2 className="text-headline-md text-on-surface mb-4">Brand Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Brand Name</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.brandName ?? settings?.brandName ?? ''}
                onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Tagline</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.tagline ?? settings?.tagline ?? ''}
                onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Logo URL</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.logoUrl ?? ''}
                onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">
                Favicon URL
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.faviconUrl ?? ''}
                onChange={(e) => setBrandForm({ ...brandForm, faviconUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <h3 className="text-body-md font-semibold text-on-surface mt-6 mb-3">
            Contact Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Email</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.contactEmail ?? ''}
                onChange={(e) => setBrandForm({ ...brandForm, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Phone</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.contactPhone ?? ''}
                onChange={(e) => setBrandForm({ ...brandForm, contactPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">WhatsApp</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.contactWhatsApp ?? ''}
                onChange={(e) => setBrandForm({ ...brandForm, contactWhatsApp: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Address</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.address ?? ''}
                onChange={(e) => setBrandForm({ ...brandForm, address: e.target.value })}
              />
            </div>
          </div>
          <h3 className="text-body-md font-semibold text-on-surface mt-6 mb-3">Shipping & Tax</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">
                Shipping Base (Rs.)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.shippingBase ?? '350'}
                onChange={(e) => setBrandForm({ ...brandForm, shippingBase: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">
                Free Shipping Threshold (Rs.)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.freeShippingThreshold ?? ''}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, freeShippingThreshold: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={brandForm.taxRate ?? '0'}
                onChange={(e) => setBrandForm({ ...brandForm, taxRate: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={saveBrand} loading={updateSettings.isPending}>
              Save Brand Settings
            </Button>
          </div>
        </div>

        {/* Homepage Banners / Campaigns */}
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-headline-md text-on-surface">Homepage Banners</h2>
            <Button onClick={() => openCampaign()}>Add Banner</Button>
          </div>
          <div className="space-y-3">
            {!campaigns || campaigns.length === 0 ? (
              <p className="text-body-md text-on-surface-variant">
                No banners yet. Create your first one.
              </p>
            ) : (
              campaigns.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-surface-container"
                >
                  <div className="flex items-center gap-4">
                    {c.imageUrl && (
                      <div className="w-16 h-10 rounded overflow-hidden bg-surface-gray shrink-0">
                        <img
                          src={c.imageUrl}
                          alt={c.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-body-md text-on-surface font-medium">{c.title}</p>
                      <p className="text-label-sm text-on-surface-variant">
                        {PLACEMENTS.find((p) => p.value === c.placement)?.label ?? c.placement}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-label-sm ${c.status === 'LIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {c.status}
                    </span>
                    <button
                      onClick={() => openCampaign(c)}
                      className="text-on-surface-variant hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(c.id);
                        setDeleteType('campaign');
                      }}
                      className="text-on-surface-variant hover:text-error"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl border border-surface-container p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-headline-md text-on-surface">Team Members</h2>
            <Button onClick={openTeam}>Add Member</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {!team || team.length === 0 ? (
              <p className="text-body-md text-on-surface-variant md:col-span-2">
                No team members yet.
              </p>
            ) : (
              team.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-surface-container"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-gray flex items-center justify-center shrink-0 overflow-hidden">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant">
                        person
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md text-on-surface font-medium">{m.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{m.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDeleteId(m.id);
                      setDeleteType('team');
                    }}
                    className="text-on-surface-variant hover:text-error"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Campaign Modal */}
      <Modal
        open={campaignModal}
        onClose={() => setCampaignModal(false)}
        title={editCampaign ? 'Edit Banner' : 'Add Banner'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Title</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
              value={campaignForm.title}
              onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
              rows={2}
              value={campaignForm.description}
              onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Image URL</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
              value={campaignForm.imageUrl}
              onChange={(e) => setCampaignForm({ ...campaignForm, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Link URL</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
              value={campaignForm.linkUrl}
              onChange={(e) => setCampaignForm({ ...campaignForm, linkUrl: e.target.value })}
              placeholder="/products/hot-sauces"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Placement</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={campaignForm.placement}
                onChange={(e) => setCampaignForm({ ...campaignForm, placement: e.target.value })}
              >
                {PLACEMENTS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-1">Sort Order</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
                value={campaignForm.sortOrder}
                onChange={(e) =>
                  setCampaignForm({ ...campaignForm, sortOrder: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setCampaignModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveCampaign}
              loading={createCampaign.isPending || updateCampaign.isPending}
            >
              {editCampaign ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Team Member Modal */}
      <Modal open={teamModal} onClose={() => setTeamModal(false)} title="Add Team Member">
        <div className="space-y-4">
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Name</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
              value={teamForm.name}
              onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Role</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
              value={teamForm.role}
              onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Bio</label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
              rows={2}
              value={teamForm.bio}
              onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1">Photo URL</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-outline-variant text-body-md focus:border-primary outline-none"
              value={teamForm.photoUrl}
              onChange={(e) => setTeamForm({ ...teamForm, photoUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setTeamModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => createTeam.mutate(teamForm)} loading={createTeam.isPending}>
              Add Member
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId && deleteType === 'campaign') deleteCampaign.mutate({ id: deleteId });
          if (deleteId && deleteType === 'team') deleteTeam.mutate({ id: deleteId });
        }}
        title={`Delete ${deleteType === 'campaign' ? 'Banner' : 'Team Member'}`}
        message={`Are you sure you want to delete this ${deleteType}?`}
        loading={deleteCampaign.isPending || deleteTeam.isPending}
      />
    </div>
  );
}
