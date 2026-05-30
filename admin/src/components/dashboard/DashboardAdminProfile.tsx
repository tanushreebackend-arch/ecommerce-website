'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';

function getDisplayName(email: string) {
  const local = email.split('@')[0] || 'Admin';
  return local.charAt(0).toUpperCase() + local.slice(1).replace(/[._-]/g, ' ');
}

export function DashboardAdminProfile() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getMe()
      .then((data: { admin?: { email?: string } }) => {
        setEmail(data?.admin?.email || null);
      })
      .catch(() => setEmail(null));
  }, []);

  if (!email) return null;

  const name = getDisplayName(email);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="dash-admin-profile">
      <div className="dash-admin-avatar">{initial}</div>
      <div className="dash-admin-info">
        <p className="dash-admin-name">{name}</p>
        <p className="dash-admin-email">{email}</p>
      </div>
    </div>
  );
}
