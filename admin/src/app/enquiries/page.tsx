'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    adminApi.getEnquiries(search).then(setEnquiries).catch(console.error);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = async (id: string, isRead: boolean) => {
    await adminApi.markEnquiryRead(id, isRead);
    load();
  };

  const handleDelete = async (id: string) => {
    await adminApi.deleteEnquiry(id);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Enquiry Inbox</h1>
        <input className="input-field w-64" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Phone</th>
              <th className="pb-3 pr-4">Message</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e._id} className={`border-b ${!e.isRead ? 'bg-blue-50/50' : ''}`}>
                <td className="py-3 pr-4 font-medium">{e.name}</td>
                <td className="py-3 pr-4">{e.email}</td>
                <td className="py-3 pr-4">{e.phone || '—'}</td>
                <td className="py-3 pr-4 max-w-xs truncate">{e.message}</td>
                <td className="py-3 pr-4 text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</td>
                <td className="py-3 pr-4">
                  <button onClick={() => toggleRead(e._id, !e.isRead)} className={`px-2 py-1 rounded text-xs ${e.isRead ? 'bg-gray-100' : 'bg-blue-100 text-blue-700'}`}>
                    {e.isRead ? 'Read' : 'Unread'}
                  </button>
                </td>
                <td className="py-3">
                  <button onClick={() => handleDelete(e._id)} className="text-red-500 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
