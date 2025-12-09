"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Estructura del usuario
interface UserData {
  userId?: string;
  name?: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  user: UserData | null;
  login: (role: string, userData?: UserData) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/auth/status");
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated) {
            setIsAuthenticated(true);
            setRole(data.role);
            
            setUser({
                userId: data.id || data.userId || data._id,
                name: data.name || data.fullName || data.user?.name,
                email: data.email
            });
          }
        }
      } catch (err) {
        console.error("Error al verificar el estado de la autenticación:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = (newRole: string, newUserData?: UserData) => {
    setIsAuthenticated(true);
    setRole(newRole);
    
    if (newUserData) {
        setUser(newUserData);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setIsAuthenticated(false);
      setRole(null);
      setUser(null); 
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};