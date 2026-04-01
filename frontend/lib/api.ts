const BASE = '/api';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string, orgName: string, email: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('orgName', orgName);
  localStorage.setItem('email', email);
}

export function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('orgName');
  localStorage.removeItem('email');
}

export function getOrgName() {
  return localStorage.getItem('orgName') || 'My Organization';
}

export function getEmail() {
  return localStorage.getItem('email') || '';
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  signup: (body: object) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: object) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getDashboard: () => request('/dashboard'),
  getProducts: () => request('/products'),
  createProduct: (body: object) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: string, body: object) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),
  getSettings: () => request('/settings'),
  updateSettings: (body: object) => request('/settings', { method: 'PUT', body: JSON.stringify(body) }),
};
