/**
 * context/AuthContext.tsx
 * Global auth state — provides user, login, logout, and login modal trigger.
 * Wrap the entire app in <AuthProvider> so all components can useAuth().
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getCurrentUser, checkAuth, login as apiLogin, logout as apiLogout, register as apiRegister } from '../../api/auth';
import type { UserMeta, RegisterPayload } from '../../api/auth';

interface AuthContextValue {
  user: UserMeta | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showLoginModal: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]                   = useState<UserMeta | null>(getCurrentUser);
  const [isLoading, setIsLoading]         = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // On mount: verify token is still valid with server
  useEffect(() => {
    checkAuth()
      .then((u) => setUser(u))
      .finally(() => setIsLoading(false));
  }, []);

  // Listen for LOGIN_MODAL events fired by the axios interceptor
  // (triggered when a guest hits a protected endpoint like Follow/Export)
  useEffect(() => {
    const handler = () => setShowLoginModal(true);
    window.addEventListener('fundvision:login_required', handler);
    return () => window.removeEventListener('fundvision:login_required', handler);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
    setShowLoginModal(false);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await apiRegister(payload);
    setUser(data.user);
    setShowLoginModal(false);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      showLoginModal,
      login,
      register,
      logout,
      openLoginModal:  () => setShowLoginModal(true),
      closeLoginModal: () => setShowLoginModal(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
