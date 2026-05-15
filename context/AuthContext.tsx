// context/AuthContext.tsx

"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import api from "@/lib/axios";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    dob: string;
    phone_number: string;
    location: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (email: string, password: string) => {
        const response = await api.post("/api/v1/auth/login/", {
            email,
            password,
        });
        setUser(response.data.user);
    };

    const register = async (data: RegisterData) => {
        const response = await api.post("/api/v1/auth/register/", data);
        setUser(response.data.user);
    };

    const logout = async () => {
        await api.post("/api/v1/auth/logout/");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
