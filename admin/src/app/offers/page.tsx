'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Pack {
  _id: string;
  label: string;
  description: string;
  price: number;
  originalPrice: number;
  savingsPercent: number;
  badge: string;
  isVisible: boolean;
  sortOrder: number;
}

export default function OffersPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [threshold, setThreshold] = useState(499);
  const [newPack, setNewPack] = useState({ label: '', price: 0, originalPrice: 0, savingsPercent: 72, badge: '' });

  useEffect(() => {
    adminApi.getPacks().then(setPacks).catch(console.error);
    adminApi.getShippingThreshold().then((d) => setThreshold(d.threshold)).catch(console.error);
  }, []);

  const handleSavePack = async (pack: Pack) => {
    try {
      await adminApi.updatePack(pack._id, pack);
      toast.success('Pack updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleCreatePack = async () => {
    try {
      const pack = await adminApi.createPack({ ...newPack, isVisible: true, sortOrder: packs.length });
      setPacks([...packs, pack]);
      setNewPack({ label: '', price: 0, originalPrice: 0, savingsPercent: 72, badge: '' });
      toast.success('Pack created!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Create failed');
    }
  };

  const handleDeletePack = async (id: string) => {
    await adminApi.deletePack(id);
    setPacks(packs.filter((p) => p._id !== id));
    toast.success('Pack deleted');
  };

  const handleSaveThreshold = async () => {
    await adminApi.updateShippingThreshold(threshold);
    toast.success('Free shipping threshold updated!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Packs & Offers</h1>

      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Free Shipping Threshold</h2>
        <p className="text-xs text-gray-500 mb-3">
          Tip: you can also change this under Sections → Announcement Bar. Both places stay in sync when saved.
        </p>
        <div className="flex gap-3 items-end">
          <div>
            <label className="text-sm text-gray-500">Minimum order amount (₹)</label>
            <input type="number" className="input-field mt-1 w-40" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
          </div>
          <button onClick={handleSaveThreshold} className="btn-admin">Save</button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {packs.map((pack) => (
          <div key={pack._id} className="card grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <input className="input-field" placeholder="Label" value={pack.label} onChange={(e) => setPacks(packs.map((p) => p._id === pack._id ? { ...p, label: e.target.value } : p))} />
            <input type="number" className="input-field" placeholder="Price" value={pack.price} onChange={(e) => setPacks(packs.map((p) => p._id === pack._id ? { ...p, price: Number(e.target.value) } : p))} />
            <input type="number" className="input-field" placeholder="Original" value={pack.originalPrice} onChange={(e) => setPacks(packs.map((p) => p._id === pack._id ? { ...p, originalPrice: Number(e.target.value) } : p))} />
            <input type="number" className="input-field" placeholder="Save %" value={pack.savingsPercent} onChange={(e) => setPacks(packs.map((p) => p._id === pack._id ? { ...p, savingsPercent: Number(e.target.value) } : p))} />
            <input className="input-field" placeholder="Badge" value={pack.badge} onChange={(e) => setPacks(packs.map((p) => p._id === pack._id ? { ...p, badge: e.target.value } : p))} />
            <div className="flex gap-2">
              <label className="flex items-center gap-1 text-sm">
                <input type="checkbox" checked={pack.isVisible} onChange={(e) => setPacks(packs.map((p) => p._id === pack._id ? { ...p, isVisible: e.target.checked } : p))} />
                Visible
              </label>
              <button onClick={() => handleSavePack(pack)} className="btn-admin text-xs">Save</button>
              <button onClick={() => handleDeletePack(pack._id)} className="text-red-500 text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Add New Pack</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input className="input-field" placeholder="Label" value={newPack.label} onChange={(e) => setNewPack({ ...newPack, label: e.target.value })} />
          <input type="number" className="input-field" placeholder="Price" value={newPack.price || ''} onChange={(e) => setNewPack({ ...newPack, price: Number(e.target.value) })} />
          <input type="number" className="input-field" placeholder="Original Price" value={newPack.originalPrice || ''} onChange={(e) => setNewPack({ ...newPack, originalPrice: Number(e.target.value) })} />
          <input className="input-field" placeholder="Badge" value={newPack.badge} onChange={(e) => setNewPack({ ...newPack, badge: e.target.value })} />
          <button onClick={handleCreatePack} className="btn-admin">Create Pack</button>
        </div>
      </div>
    </div>
  );
}
