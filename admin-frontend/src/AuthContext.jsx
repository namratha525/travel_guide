import { createContext, useContext, useState, useEffect } from "react";
import * as api from "./api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const stored = localStorage.getItem("adminUser");
    if (token && stored) {
      setAdmin(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await api.login(email, password);
    if (data.user?.role !== "admin") throw new Error("Not an admin account");
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser", JSON.stringify(data.user));
    setAdmin(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
