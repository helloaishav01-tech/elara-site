import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("elara_token");
    if (!token) { setLoading(false); return; }
    axios.get(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => setUser(r.data))
      .catch(() => localStorage.removeItem("elara_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${BASE}/api/auth/login`, { email, password });
    localStorage.setItem("elara_token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await axios.post(`${BASE}/api/auth/register`, data);
    localStorage.setItem("elara_token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("elara_token");
    setUser(null);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("elara_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}