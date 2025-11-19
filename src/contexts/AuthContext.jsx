import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/services/authApi';
import { apiClient } from '@/services/apiClient';

const AuthContext = createContext(null);
const ACTIVE_VILLAGE_KEY = 'desaCantikActiveVillage';

const readActiveVillage = () => {
  try {
    return localStorage.getItem(ACTIVE_VILLAGE_KEY);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authApi.getStoredUser());
  const [activeVillageId, setActiveVillageId] = useState(
    readActiveVillage() || authApi.getStoredUser()?.village?.id?.toString() || null,
  );
  const token = apiClient.getToken();

  useEffect(() => {
    if (!user && token) {
      authApi
        .me()
        .then((profile) => {
          if (profile) {
            setUser(profile);
            if (!activeVillageId && profile?.village?.id) {
              setActiveVillageId(profile.village.id.toString());
            }
          }
        })
        .catch(() => {
          authApi.logout();
          setUser(null);
        });
    }
  }, [user, token, activeVillageId]);

  useEffect(() => {
    try {
      if (activeVillageId) {
        localStorage.setItem(ACTIVE_VILLAGE_KEY, activeVillageId);
      } else {
        localStorage.removeItem(ACTIVE_VILLAGE_KEY);
      }
    } catch {
      /* ignore storage errors */
    }
  }, [activeVillageId]);

  const value = useMemo(
    () => ({
      user,
      token,
      activeVillageId,
      setActiveVillageId,
      login: async (username, password) => {
        const { user: loggedInUser } = await authApi.login(username, password);
        setUser(loggedInUser);
        if (loggedInUser?.village?.id) {
          setActiveVillageId(loggedInUser.village.id.toString());
        }
        return loggedInUser;
      },
      logout: () => {
        authApi.logout();
        setUser(null);
        setActiveVillageId(null);
      },
      refreshUser: async () => {
        const profile = await authApi.me();
        setUser(profile);
        if (profile?.village?.id) {
          setActiveVillageId(profile.village.id.toString());
        }
        return profile;
      },
    }),
    [user, token, activeVillageId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};