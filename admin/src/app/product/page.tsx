'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ProductImageManager from '@/components/ProductImageManager';
import BrandingSection from '@/components/BrandingSection';
import ProductPreview from '@/components/ProductPreview';

interface ProductImage {
  url: string;
  publicId?: string;
  sortOrder?: number;
}

export default function ProductPage() {
  const [product, setProduct] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getProduct().then(setProduct).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminApi.updateProduct(product);
      setProduct(updated);
      toast.success('Product saved!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const updateBenefit = (index: number, value: string) => {
    const benefits = [...((product.benefits as string[]) || [])];
    benefits[index] = value;
    setProduct({ ...product, benefits });
  };

  const addBenefit = () => {
    setProduct({ ...product, benefits: [...((product.benefits as string[]) || []), ''] });
  };

  const removeBenefit = (index: number) => {
    const benefits = ((product.benefits as string[]) || []).filter((_, i) => i !== index);
    setProduct({ ...product, benefits });
  };

  const images = (product.images as ProductImage[]) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Product Manager</h1>
        <button onClick={handleSave} disabled={saving} className="btn-admin">{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold">Basic Info</h2>
            <div>
              <label className="text-sm text-gray-500">Product Name</label>
              <input className="input-field mt-1" value={(product.name as string) || ''} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-500">Badge Text</label>
              <input className="input-field mt-1" value={(product.badge as string) || ''} placeholder="e.g. Best Seller" onChange={(e) => setProduct({ ...product, badge: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500">Sale Price (₹)</label>
                <input type="number" className="input-field mt-1" value={(product.salePrice as number) || ''} onChange={(e) => setProduct({ ...product, salePrice: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm text-gray-500">MRP (₹)</label>
                <input type="number" className="input-field mt-1" value={(product.mrp as number) || ''} onChange={(e) => setProduct({ ...product, mrp: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Stock Count</label>
              <input type="number" className="input-field mt-1" value={(product.stock as number) || ''} onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm text-gray-500">Rating Text</label>
              <input className="input-field mt-1" value={(product.ratingText as string) || ''} onChange={(e) => setProduct({ ...product, ratingText: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-500">Description</label>
              <textarea className="input-field mt-1" rows={4} value={(product.description as string) || ''} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-500">Delivery Text</label>
              <input className="input-field mt-1" value={(product.deliveryText as string) || ''} onChange={(e) => setProduct({ ...product, deliveryText: e.target.value })} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Benefit Points</h2>
              <button onClick={addBenefit} className="btn-admin-outline text-xs">+ Add</button>
            </div>
            {((product.benefits as string[]) || []).map((b, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className="input-field" value={b} onChange={(e) => updateBenefit(i, e.target.value)} />
                <button onClick={() => removeBenefit(i)} className="text-red-500 text-sm px-2">✕</button>
              </div>
            ))}
          </div>

          <BrandingSection product={product} onUpdate={setProduct} />

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Product Images</h2>
              <button
                type="button"
                className="btn-admin-outline text-xs"
                onClick={async () => {
                  try {
                    const updated = await adminApi.applyDefaultProductImages();
                    setProduct(updated);
                    toast.success('Default supplement images applied');
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : 'Failed');
                  }
                }}
              >
                Apply Default Photos
              </button>
            </div>
            <ProductImageManager
              images={images}
              onChange={(imgs) => setProduct({ ...product, images: imgs })}
              onUpload={async (blobs) => {
                const fd = new FormData();
                blobs.forEach((b, i) => fd.append('images', b, `image-${i}.jpg`));
                const updated = await adminApi.uploadImages(fd);
                setProduct(updated);
                return updated.images as ProductImage[];
              }}
              onReplace={async (index, blob) => {
                const fd = new FormData();
                fd.append('image', blob, 'image.jpg');
                const updated = await adminApi.replaceProductImage(index, fd);
                setProduct(updated);
              }}
              onDelete={async (index) => {
                const updated = await adminApi.deleteProductImage(index);
                setProduct(updated);
              }}
              onReorder={async (order) => {
                const updated = await adminApi.reorderProductImages(order);
                setProduct(updated);
              }}
            />
          </div>
        </div>

        <ProductPreview product={product} />
      </div>
    </div>
  );
}
