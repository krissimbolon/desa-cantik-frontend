import { apiClient } from './apiClient';

const USER_KEY = 'desaCantikUser';

const persistUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* ignore storage errors */
  }
};

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const authApi = {
  async login(username, password) {
    const response = await apiClient.post('/auth/login', {
      login: username,
      password,
    });

    const { token, user } = response?.data || {};
    if (token) {
      apiClient.setToken(token);
    }
    if (user) {
      persistUser(user);
    }

    return { token, user };
  },

  async me() {
    const response = await apiClient.get('/auth/user');
    const user = response?.data;
    if (user) {
      persistUser(user);
    }
    return user;
  },

  logout() {
    apiClient.clearToken();
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore storage errors */
    }
  },

  getStoredUser: readStoredUser,
};
