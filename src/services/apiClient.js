// Lightweight fetch wrapper for the Desa Cantik API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const TOKEN_KEY = 'desaCantikToken';

let authToken = null;

const storedToken = (() => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
})();

if (storedToken) {
  authToken = storedToken;
}

const buildUrl = (path, params) => {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
  }

  return url.toString();
};

const request = async (method, path, { data, params, headers } = {}) => {
  const url = buildUrl(path, params);

  const requestHeaders = new Headers(headers || {});
  if (authToken) {
    requestHeaders.set('Authorization', `Bearer ${authToken}`);
  }

  const isFormData = data instanceof FormData;
  if (data && !isFormData && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: isFormData ? data : data ? JSON.stringify(data) : undefined,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || json?.success === false) {
    const message =
      json?.message ||
      json?.errors?.[0] ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return json;
};

const setToken = (token) => {
  authToken = token;
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    /* ignore storage errors */
  }
};

export const apiClient = {
  get: (path, options) => request('GET', path, options),
  post: (path, data, options = {}) => request('POST', path, { ...options, data }),
  put: (path, data, options = {}) => request('PUT', path, { ...options, data }),
  delete: (path, options) => request('DELETE', path, options),
  setToken,
  clearToken: () => setToken(null),
  getToken: () => authToken,
};
