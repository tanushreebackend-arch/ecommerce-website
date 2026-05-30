import {
  BarChart2,
  Calendar,
  DollarSign,
  MessageSquare,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export const STAT_CARD_ICONS: Record<string, LucideIcon> = {
  'Total Revenue': DollarSign,
  'Total Orders': ShoppingBag,
  'Total Customers': Users,
  'Total Products': Package,
  'Orders Today': TrendingUp,
  'Orders This Month': Calendar,
  'Revenue Today': Zap,
  'Revenue This Month': BarChart2,
  'Pending Reviews': Star,
  'New Enquiries': MessageSquare,
};

export function formatDashboardDate(date = new Date()) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getOrderStatusBadge(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === 'pending') return 'pending';
  if (['processing', 'shipped', 'out_for_delivery'].includes(normalized)) return 'processing';
  if (normalized === 'delivered') return 'delivered';
  return 'pending';
}
