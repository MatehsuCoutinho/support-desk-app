import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/auth.service";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function login(newToken: string) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        const data = await getMe();
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}