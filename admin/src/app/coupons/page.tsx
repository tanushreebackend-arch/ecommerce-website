'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

function CouponBadgePreview({ coupon }: { coupon: Partial<Coupon> }) {
  if (!coupon.code) return null;
  const label = coupon.discountType === 'flat' ? `₹${coupon.value || 0} OFF` : `${coupon.value || 0}% OFF`;

  return (
    <div className="card sticky top-6">
      <h2 className="font-semibold mb-4">Checkout Preview</h2>
      <div className="rounded-xl border bg-gray-50 p-5">
        <p className="text-xs text-gray-400 mb-3">How the coupon badge appears at checkout</p>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-gray-500 mb-2">Order Summary</p>
          <div className="flex items-center justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm font-semibold">₹1,499</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
              🏷️ {coupon.code} — {label}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-emerald-600 text-sm">
            <span>Discount</span>
            <span>-{coupon.discountType === 'flat' ? `₹${coupon.value}` : `${coupon.value}%`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState<{
    code: string;
    discountType: 'percentage' | 'flat';
    value: number;
    minOrder: number;
    expiryDate: string;
    usageLimit: number;
  }>({
    code: '', discountType: 'percentage', value: 10, minOrder: 0,
    expiryDate: '', usageLimit: 100,
  });

  useEffect(() => {
    adminApi.getCoupons().then(setCoupons).catch(console.error);
  }, []);

  const handleCreate = async () => {
    try {
      const coupon = await adminApi.createCoupon(form);
      setCoupons([coupon, ...coupons]);
      toast.success('Coupon created!');
      setForm({ code: '', discountType: 'percentage', value: 10, minOrder: 0, expiryDate: '', usageLimit: 100 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Create failed');
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    const updated = await adminApi.updateCoupon(coupon._id, { isActive: !coupon.isActive });
    setCoupons(coupons.map((c) => c._id === coupon._id ? updated : c));
  };

  const handleDelete = async (id: string) => {
    await adminApi.deleteCoupon(id);
    setCoupons(coupons.filter((c) => c._id !== id));
    toast.success('Deleted');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Coupon Manager</h1>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        <div>
          <div className="card mb-6">
            <h2 className="font-semibold mb-4">Create New Coupon</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <input className="input-field" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              <select className="input-field" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'flat' })}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
              <input type="number" className="input-field" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
              <input type="number" className="input-field" placeholder="Min Order" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
              <input type="date" className="input-field" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              <button onClick={handleCreate} className="btn-admin">Create</button>
            </div>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 pr-4">Code</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Value</th>
                  <th className="pb-3 pr-4">Min Order</th>
                  <th className="pb-3 pr-4">Expiry</th>
                  <th className="pb-3 pr-4">Usage</th>
                  <th className="pb-3 pr-4">Active</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id} className="border-b">
                    <td className="py-3 pr-4 font-mono font-bold">{c.code}</td>
                    <td className="py-3 pr-4 capitalize">{c.discountType}</td>
                    <td className="py-3 pr-4">{c.discountType === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                    <td className="py-3 pr-4">₹{c.minOrder}</td>
                    <td className="py-3 pr-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">{c.usageCount}/{c.usageLimit}</td>
                    <td className="py-3 pr-4">
                      <button onClick={() => toggleActive(c)} className={`px-2 py-1 rounded text-xs ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3">
                      <button onClick={() => handleDelete(c._id)} className="text-red-500 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CouponBadgePreview coupon={form} />
      </div>
    </div>
  );
}
