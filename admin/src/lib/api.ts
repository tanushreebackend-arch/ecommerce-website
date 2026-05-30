const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: isFormData ? { ...options.headers } : { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export function uploadWithProgress(
  endpoint: string,
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${API_URL}${endpoint}`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data.message || 'Upload failed'));
      } catch {
        reject(new Error('Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
}

export const adminApi = {
  login: (email: string, password: string) =>
    fetchAPI('/api/auth/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => fetchAPI('/api/auth/admin/logout', { method: 'POST' }),
  getMe: () => fetchAPI('/api/auth/admin/me'),
  getDashboard: () => fetchAPI('/api/admin/dashboard/stats'),
  getProduct: () => fetchAPI('/api/admin/product'),
  updateProduct: (data: object) => fetchAPI('/api/admin/product', { method: 'PUT', body: JSON.stringify(data) }),
  uploadImages: (formData: FormData) => fetchAPI('/api/admin/product/images', { method: 'POST', body: formData }),
  uploadLogo: (formData: FormData) => fetchAPI('/api/admin/product/logo', { method: 'POST', body: formData }),
  uploadComparisonImage: (formData: FormData) => fetchAPI('/api/admin/product/comparison-image', { method: 'POST', body: formData }),
  replaceProductImage: (index: number, formData: FormData) =>
    fetchAPI(`/api/admin/product/images/${index}/replace`, { method: 'PUT', body: formData }),
  deleteProductImage: (index: number) =>
    fetchAPI(`/api/admin/product/images/${index}`, { method: 'DELETE' }),
  reorderProductImages: (order: number[]) =>
    fetchAPI('/api/admin/product/images/reorder', { method: 'PUT', body: JSON.stringify({ order }) }),
  applyDefaultProductImages: () => fetchAPI('/api/admin/product/images/apply-defaults', { method: 'PUT' }),
  getPacks: () => fetchAPI('/api/admin/packs'),
  createPack: (data: object) => fetchAPI('/api/admin/packs', { method: 'POST', body: JSON.stringify(data) }),
  updatePack: (id: string, data: object) => fetchAPI(`/api/admin/packs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePack: (id: string) => fetchAPI(`/api/admin/packs/${id}`, { method: 'DELETE' }),
  getSections: () => fetchAPI('/api/admin/sections'),
  getSection: (name: string) => fetchAPI(`/api/admin/sections/${name}`),
  updateSection: (name: string, data: object) =>
    fetchAPI(`/api/admin/sections/${name}`, { method: 'PUT', body: JSON.stringify(data) }),
  uploadSectionImage: (name: string, formData: FormData) =>
    fetchAPI(`/api/admin/sections/${name}/image`, { method: 'POST', body: formData }),
  getTheme: () => fetchAPI('/api/admin/theme'),
  updateTheme: (data: object) => fetchAPI('/api/admin/theme', { method: 'PUT', body: JSON.stringify(data) }),
  getCoupons: () => fetchAPI('/api/admin/coupons'),
  createCoupon: (data: object) => fetchAPI('/api/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateCoupon: (id: string, data: object) => fetchAPI(`/api/admin/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoupon: (id: string) => fetchAPI(`/api/admin/coupons/${id}`, { method: 'DELETE' }),
  getPendingReviews: () => fetchAPI('/api/admin/reviews/pending'),
  getPublishedReviews: () => fetchAPI('/api/admin/reviews/published'),
  approveReview: (id: string) => fetchAPI(`/api/admin/reviews/${id}/approve`, { method: 'PUT' }),
  rejectReview: (id: string) => fetchAPI(`/api/admin/reviews/${id}/reject`, { method: 'PUT' }),
  unpublishReview: (id: string) => fetchAPI(`/api/admin/reviews/${id}/unpublish`, { method: 'PUT' }),
  pinReview: (id: string, isPinned: boolean) =>
    fetchAPI(`/api/admin/reviews/${id}/pin`, { method: 'PUT', body: JSON.stringify({ isPinned }) }),
  getEnquiries: (search?: string) => fetchAPI(`/api/admin/enquiries${search ? `?search=${search}` : ''}`),
  markEnquiryRead: (id: string, isRead: boolean) =>
    fetchAPI(`/api/admin/enquiries/${id}/read`, { method: 'PUT', body: JSON.stringify({ isRead }) }),
  deleteEnquiry: (id: string) => fetchAPI(`/api/admin/enquiries/${id}`, { method: 'DELETE' }),
  replyEnquiry: (id: string, replyMessage: string) =>
    fetchAPI(`/api/admin/enquiries/${id}/reply`, { method: 'POST', body: JSON.stringify({ replyMessage }) }),
  getOrders: () => fetchAPI('/api/admin/orders'),
  getOrder: (id: string) => fetchAPI(`/api/admin/orders/${id}`),
  updateOrderStatus: (id: string, data: object) =>
    fetchAPI(`/api/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  getVideos: () => fetchAPI('/api/admin/videos'),
  uploadVideo: (slot: number, formData: FormData, onProgress?: (percent: number) => void) =>
    uploadWithProgress(`/api/admin/videos/${slot}`, formData, onProgress),
  uploadVideoThumbnail: (slot: number, formData: FormData) =>
    fetchAPI(`/api/admin/videos/${slot}`, { method: 'PUT', body: formData }),
  getPolicy: (type: string) => fetchAPI(`/api/admin/policies/${type}`),
  updatePolicy: (type: string, data: object) =>
    fetchAPI(`/api/admin/policies/${type}`, { method: 'PUT', body: JSON.stringify(data) }),
  getShippingThreshold: () => fetchAPI('/api/admin/settings/shipping'),
  updateShippingThreshold: (threshold: number) =>
    fetchAPI('/api/admin/settings/shipping', { method: 'PUT', body: JSON.stringify({ threshold }) }),
  getEmailSettings: () => fetchAPI('/api/admin/emails/settings'),
  updateEmailSettings: (data: object) =>
    fetchAPI('/api/admin/emails/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getEmailPreview: async (type: string) => {
    const res = await fetch(`${API_URL}/api/admin/emails/preview/${type}?v=2`, {
      credentials: 'include',
      cache: 'no-store',
    });
    const text = await res.text();
    if (!res.ok) {
      try {
        const data = JSON.parse(text);
        throw new Error(data.message || 'Preview failed');
      } catch (err) {
        if (err instanceof Error && err.message !== 'Preview failed') throw err;
        throw new Error(text || 'Preview failed');
      }
    }
    return text;
  },
  getAllBlogs: () => fetchAPI('/api/blogs/all'),
  createBlog: (data: object) => fetchAPI('/api/blogs', { method: 'POST', body: JSON.stringify(data) }),
  updateBlog: (id: string, data: object) => fetchAPI(`/api/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlog: (id: string) => fetchAPI(`/api/blogs/${id}`, { method: 'DELETE' }),
  uploadBlogCover: (formData: FormData) => fetchAPI('/api/admin/blogs/cover-image', { method: 'POST', body: formData }),
  getAllDigitalProducts: () => fetchAPI('/api/digital-products/all'),
  getDigitalProduct: (id: string) => fetchAPI(`/api/digital-products/manage/${id}`),
  createDigitalProduct: (data: object) => fetchAPI('/api/digital-products', { method: 'POST', body: JSON.stringify(data) }),
  updateDigitalProduct: (id: string, data: object) =>
    fetchAPI(`/api/digital-products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDigitalProduct: (id: string) => fetchAPI(`/api/digital-products/${id}`, { method: 'DELETE' }),
  uploadDigitalProductFile: (formData: FormData) =>
    fetchAPI('/api/digital-products/upload-file', { method: 'POST', body: formData }),
  uploadDigitalProductCover: (formData: FormData) =>
    fetchAPI('/api/digital-products/upload-cover', { method: 'POST', body: formData }),
};

export default adminApi;
