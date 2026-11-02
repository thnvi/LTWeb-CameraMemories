import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import backendClient from '../api/backendClient';

const AuthContext = createContext(null);

const normalizeAxiosError = (err) => {
  if (err?.response) return err;
  const e = new Error('Không kết nối được server API (http://localhost:5000). Hãy kiểm tra backend đang chạy và REACT_APP_API_URL.');
  // attach original
  e.original = err;
  return e;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const login = async (email, password) => {
    const { data } = await backendClient.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await backendClient.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await backendClient.get('/auth/me');
        setUser(data.user);
      } catch (e) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
