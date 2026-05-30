const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: isFormData
      ? { ...options.headers }
      : { 'Content-Type': 'application/json', ...options.headers },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  getSettings: () => fetchAPI('/api/settings/all'),
  getTheme: () => fetchAPI('/api/theme'),
  getPublishedReviews: () => fetchAPI('/api/reviews/published'),
  submitReview: (data: FormData | object) =>
    data instanceof FormData
      ? fetchAPI('/api/reviews', { method: 'POST', body: data })
      : fetchAPI('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
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
  getBlogs: () => fetchAPI('/api/blogs'),
  getBlog: (slug: string) => fetchAPI(`/api/blogs/${slug}`),
  getDigitalProducts: () => fetchAPI('/api/digital-products'),
  getDigitalProduct: (id: string) => fetchAPI(`/api/digital-products/${id}`),
  purchaseDigitalProduct: (id: string, data: object) =>
    fetchAPI(`/api/digital-products/${id}/purchase`, { method: 'POST', body: JSON.stringify(data) }),
};

export default api;
