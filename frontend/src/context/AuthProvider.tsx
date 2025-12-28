import { createContext, useState, useCallback } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { AuthState } from "../types/auth";

interface AuthContextType {
    auth: AuthState;
    setAuth: Dispatch<SetStateAction<AuthState>>;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [auth, setAuth] = useState<AuthState>({});

    const login = useCallback(async (username: string, password: string) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include' 
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erreur lors de la connexion");
        }

        if (data.accessToken && data.user) {
            setAuth({ user: data.user, accessToken: data.accessToken });
        }
    }, []);

    const register = useCallback(async (username: string, email: string, password: string) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erreur lors de l'inscription");
        }
        
        if (data.accessToken && data.user) {
            setAuth({ user: data.user, accessToken: data.accessToken });
        }
    }, []);

    const logout = useCallback(async () => {
        setAuth({}); 
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include' 
            });
        } catch (err) {
            console.error("Logout failed", err);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;