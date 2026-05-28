export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999';

const TOKEN_KEY = 'dvt_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Resolve a server-relative asset path (e.g. /uploads/x.png) to an absolute URL.
export const assetUrl = (p) => (p && p.startsWith('/') ? `${API_URL}${p}` : p);

/**
 * Thin fetch wrapper.
 * - JSON by default; pass `isForm: true` with a FormData body for uploads.
 * - `auth: true` attaches the bearer token.
 */
export async function api(path, { method = 'GET', body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm && body) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.errors?.[0]?.message || data.message || 'Request failed');
  }
  return data;
}
