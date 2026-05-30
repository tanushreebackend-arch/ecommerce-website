'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  addresses: Record<string, string>[];
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMe()
      .then(setUser)
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await api.logout();
    toast.success('Logged out');
    router.push('/');
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="page-heading">My Account</h1>
        <button onClick={handleLogout} className="text-sm text-[#555555] hover:underline">Logout</button>
      </div>

      <div className="bg-[#F5F5F5] rounded-2xl p-6 mb-8">
        <h2 className="section-label mb-2">Profile</h2>
        <p>{user.firstName} {user.lastName}</p>
        <p className="text-[#999999] text-sm">{user.email}</p>
      </div>

      <div className="bg-[#F5F5F5] rounded-2xl p-6 mb-8">
        <h2 className="section-label mb-4">Saved Addresses</h2>
        {user.addresses?.length > 0 ? (
          user.addresses.map((addr, i) => (
            <div key={i} className="text-sm text-[#555555] mb-2">
              {addr.address}, {addr.city}, {addr.state} {addr.pinCode}
            </div>
          ))
        ) : (
          <p className="text-sm text-[#999999]">No saved addresses yet.</p>
        )}
      </div>

      <div className="bg-[#F5F5F5] rounded-2xl p-6">
        <h2 className="section-label mb-4">Order History</h2>
        <p className="text-sm text-[#999999]">
          <a href="/track-order" className="underline">Track an order</a> using your order ID and email.
        </p>
      </div>
    </div>
  );
}
