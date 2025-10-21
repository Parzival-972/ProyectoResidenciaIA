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
    role: string | null;
    login: (role: string) => void;
    logout: () => void;
    loading: boolean;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Al cargar la aplicación, verifica si la sesión está activa
      const checkAuthStatus = async () => {
        try {
          const res = await fetch("/api/auth/status");
          if (res.ok) {
            const data = await res.json();
            if (data.isAuthenticated) {
              setIsAuthenticated(true);
              setRole(data.role);
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

    const login = (newRole: string) => {
      // Ya no recibir el token el servidor, ya lo maneja
      setIsAuthenticated(true);
      setRole(newRole);
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
      }
    };

    if (loading) {
      return <div>Cargando...</div>;
    }

    return (
      <AuthContext.Provider
        value={{ isAuthenticated, role, login, logout, loading }}
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