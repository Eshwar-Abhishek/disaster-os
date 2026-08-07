import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: 'commander-demo-01',
  name: 'Chief Commander',
  full_name: 'Chief Commander',
  email: 'operator@resq.gov',
  role: 'COMMANDER',
  region: 'Central Command EOC'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('resq_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return { ...parsed, role: (parsed.role || 'COMMANDER').toUpperCase() };
      } catch (e) {}
    }
    return DEFAULT_DEMO_USER;
  });

  const [token, setToken] = useState(localStorage.getItem('resq_jwt_token') || 'demo-jwt-token-active');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('resq_jwt_token', token);
    localStorage.setItem('resq_user', JSON.stringify(user));
  }, [token, user]);

  const switchRole = (newRole) => {
    const roleUpper = newRole.toUpperCase();
    const updatedUser = {
      ...user,
      role: roleUpper,
      name: roleUpper === 'ADMIN' ? 'System Administrator' : roleUpper === 'VICTIM' ? 'Citizen Victim' : 'Chief Commander',
      email: roleUpper === 'ADMIN' ? 'admin@resq.gov' : roleUpper === 'VICTIM' ? 'citizen@resq.gov' : 'operator@resq.gov'
    };
    setUser(updatedUser);
    localStorage.setItem('resq_user', JSON.stringify(updatedUser));
  };

  const login = async (email, password, roleTab) => {
    const res = await api.login({ email, password, role: roleTab }).catch(() => null);
    const targetRole = (roleTab || 'COMMANDER').toUpperCase();
    const userObj = res?.user ? { ...res.user, role: (res.user.role || targetRole).toUpperCase() } : {
      id: `user-${Date.now()}`,
      name: targetRole === 'ADMIN' ? 'System Administrator' : targetRole === 'VICTIM' ? 'Citizen Victim' : 'Chief Commander',
      email,
      role: targetRole,
      region: 'EOC Central'
    };

    setToken(res?.token || 'demo-jwt-token-active');
    setUser(userObj);
    localStorage.setItem('resq_jwt_token', res?.token || 'demo-jwt-token-active');
    localStorage.setItem('resq_user', JSON.stringify(userObj));
    return { token: res?.token || 'demo-jwt-token-active', user: userObj };
  };

  const logout = () => {
    switchRole('COMMANDER');
  };

  const role = (user?.role || 'COMMANDER').toUpperCase();
  const isAdmin = role === 'ADMIN';
  const isCommander = role === 'COMMANDER' || role === 'ADMIN' || role === 'OPERATOR';
  const isVictim = role === 'VICTIM' || role === 'CITIZEN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: true,
        isAdmin,
        isCommander,
        isVictim,
        login,
        logout,
        switchRole,
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
