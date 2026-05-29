'use client';

import { useEffect } from 'react';

export default function AdminRedirect() {
  useEffect(() => {
    window.location.href = 'https://ecommerce-website-1uqm.vercel.app';
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Jost, sans-serif',
      }}
    >
      <p>Redirecting to admin panel...</p>
    </div>
  );
}
