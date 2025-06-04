"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  role: string | null; // Add role to the context
  login: (token: string, role: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Add role state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role"); // Retrieve role
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole); // Store role
    setToken(newToken);
    setRole(newRole); // Update role state
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Remove role
    setToken(null);
    setRole(null); // Reset role
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, role, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
