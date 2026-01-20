import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  role: string | null;
  loading: boolean;
  accessDenied: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setAccessDenied(false);

        const adminCheck = await fetch("/api/admin/check");
        if (adminCheck.ok) {
          const adminData = await adminCheck.json();
          setIsAdmin(adminData.isAdmin);
          setRole(adminData.role);
        }
        return;
      }

      if (response.status === 401 || response.status === 403) {
        setUser(null);
        setIsAdmin(false);
        setRole(null);
        setAccessDenied(true);
      }
    } catch (error) {
      console.error("Access check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, role, loading, accessDenied }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
