const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  getSettings: () => fetchAPI('/api/settings/all'),
  getPublishedReviews: () => fetchAPI('/api/reviews/published'),
  submitReview: (data: object) => fetchAPI('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
  submitEnquiry: (data: object) => fetchAPI('/api/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  validateCoupon: (code: string, orderTotal: number) =>
    fetchAPI('/api/coupons/validate', { method: 'POST', body: JSON.stringify({ code, orderTotal }) }),
  getAvailableCoupons: () => fetchAPI('/api/coupons/available'),
  createPayment: (amount: number) =>
    fetchAPI('/api/orders/create-payment', { method: 'POST', body: JSON.stringify({ amount }) }),
  verifyPayment: (data: object) =>
    fetchAPI('/api/orders/verify-payment', { method: 'POST', body: JSON.stringify(data) }),
  createOrder: (data: object) => fetchAPI('/api/orders', { method: 'POST', body: JSON.stringify(data) }),
  trackOrder: (orderId: string, email: string) =>
    fetchAPI('/api/orders/track', { method: 'POST', body: JSON.stringify({ orderId, email }) }),
  getOrder: (id: string) => fetchAPI(`/api/orders/${id}`),
  getPolicy: (type: string) => fetchAPI(`/api/settings/policies/${type}`),
  getContact: () => fetchAPI('/api/settings/contact'),
  login: (email: string, password: string) =>
    fetchAPI('/api/auth/user/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (data: object) => fetchAPI('/api/auth/user/signup', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchAPI('/api/auth/user/logout', { method: 'POST' }),
  getMe: () => fetchAPI('/api/auth/user/me'),
  syncCart: (items: object[]) =>
    fetchAPI('/api/cart/sync', { method: 'PUT', body: JSON.stringify({ items }) }),
};

export default api;
