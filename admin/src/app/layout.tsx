import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import AdminLayout from '@/components/AdminLayout';
import AuthGuard from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'Admin Panel — Premium Wellness',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthGuard>
          <AdminLayout>{children}</AdminLayout>
        </AuthGuard>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
