import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
    }, []);

    function login(newToken: string) {
        setToken(newToken);
        localStorage.setItem("token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }

    function logout() {
        setToken(null);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}