'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/login') return;
    adminApi.getMe().catch(() => router.push('/login'));
  }, [pathname, router]);

  return <>{children}</>;
}
