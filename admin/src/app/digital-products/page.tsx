'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

interface DigitalProduct {
  _id: string;
  title: string;
  price: number;
  fileType: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function DigitalProductsAdminPage() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllDigitalProducts();
      setProducts(data as DigitalProduct[]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.deleteDigitalProduct(deleteId);
      setProducts((prev) => prev.filter((p) => p._id !== deleteId));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Digital Products</h1>
        <Link href="/digital-products/new" className="btn-admin">
          Add New
        </Link>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 p-4">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 p-8 text-center">No digital products yet. Click Add New to create one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">File type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.title}</td>
                  <td className="p-4">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="p-4 uppercase">{product.fileType}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/digital-products/${product._id}/edit`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(product._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold mb-2">Delete product?</h3>
            <p className="text-sm text-gray-600 mb-6">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-gray-600">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
