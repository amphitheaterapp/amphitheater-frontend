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
    confirm_password: string;
    name: string;
    dob: string;
    phone_number: string;
    location_label: string;
    latitude: number | null;
    longitude: number | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // pre-load the users session if exists.
    useEffect(() => {
        const restoreSession = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/api/v1/profile/");
                setUser({
                    id: response.data.id,
                    email: response.data.email,
                    name: response.data.name,
                });
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post("/api/v1/auth/login/", {
            email,
            password,
        });
        console.log(response.data.user);
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
            {mounted ? children : null}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
