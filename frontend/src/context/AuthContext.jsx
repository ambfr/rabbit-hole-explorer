import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, signup as signupApi } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(localStorage.getItem("userEmail"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    setToken(data.access_token);
    setUser(email);
    localStorage.setItem("userEmail", email);
    return data;
  };

  const signup = async (username, email, password) => {
    const data = await signupApi(username, email, password);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}