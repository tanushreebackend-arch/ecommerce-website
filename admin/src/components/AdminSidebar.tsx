'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  LayoutDashboard, Package, Tag, FileText, Palette, Ticket,
  Star, Video, Mail, ShoppingCart, LogOut, Send, BookOpen, Download, Search,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/product', label: 'Product', icon: Package },
  { href: '/offers', label: 'Packs & Offers', icon: Tag },
  { href: '/sections', label: 'Sections', icon: FileText },
  { href: '/theme', label: 'Theme', icon: Palette },
  { href: '/coupons', label: 'Coupons', icon: Ticket },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/digital-products', label: 'Digital Products', icon: Download },
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/enquiries', label: 'Enquiries', icon: Mail },
  { href: '/emails', label: 'Emails', icon: Send },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/policies', label: 'Policies', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNavItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return navItems;
    return navItems.filter(({ label }) => label.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleLogout = async () => {
    await adminApi.logout();
    toast.success('Logged out');
    router.push('/login');
  };

  if (pathname === '/login') return null;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col z-40">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <p className="text-xs text-gray-400 mt-1">Premium Wellness CMS</p>
        <div className="admin-sidebar-search mt-4">
          <Search size={16} className="admin-sidebar-search-icon" aria-hidden />
          <input
            type="search"
            className="admin-sidebar-search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search navigation"
          />
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              pathname.startsWith(href) ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
        {filteredNavItems.length === 0 && (
          <p className="px-3 py-2 text-sm text-gray-500">No matching links</p>
        )}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white w-full">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
