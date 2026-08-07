import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('resq_jwt_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('resq_jwt_token');
      const storedUser = localStorage.getItem('resq_user');

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser({ ...parsed, role: (parsed.role || 'VICTIM').toUpperCase() });
        } catch (e) {
          console.error('Error parsing cached user:', e);
        }
      }

      if (storedToken) {
        try {
          const res = await api.getProfile();
          if (res.user) {
            const normalizedRole = (res.user.role || 'VICTIM').toUpperCase();
            const updated = { ...res.user, role: normalizedRole };
            setUser(updated);
            localStorage.setItem('resq_user', JSON.stringify(updated));
          }
        } catch (err) {
          console.warn('Profile session verification failed:', err.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password, roleTab) => {
    const res = await api.login({ email, password, role: roleTab });
    if (res.token && res.user) {
      const normalizedRole = (res.user.role || 'VICTIM').toUpperCase();
      const userObj = { ...res.user, role: normalizedRole };
      setToken(res.token);
      setUser(userObj);
      localStorage.setItem('resq_jwt_token', res.token);
      localStorage.setItem('resq_user', JSON.stringify(userObj));
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('resq_jwt_token');
    localStorage.removeItem('resq_user');
  };

  const role = (user?.role || '').toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isCommander = role === 'COMMANDER' || role === 'ADMIN' || role === 'OPERATOR';
  const isVictim = role === 'VICTIM' || role === 'CITIZEN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!user && !!token,
        isAdmin,
        isCommander,
        isVictim,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
