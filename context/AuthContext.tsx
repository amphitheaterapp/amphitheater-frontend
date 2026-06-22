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
    avatar_url: string | null;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    updateAvatarUrl: (url: string | null) => void;
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
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const restoreSession = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/api/v1/profile/");
                setUser({
                    id: response.data.id,
                    email: response.data.email,
                    name: response.data.name,
                    avatar_url: response.data.avatar_url ?? null,
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
        setUser(response.data.user);
    };

    const register = async (data: RegisterData) => {
        const response = await api.post("/api/v1/auth/register/", data);
        // RegisterView's response only ever has id, email, name,
        // confirmed from the actual view code. null here isn't a
        // guess, a brand new account genuinely has no avatar yet.
        setUser({
            ...response.data.user,
            avatar_url: null,
        });
    };

    const logout = async () => {
        await api.post("/api/v1/auth/logout/");
        setUser(null);
    };

    // Patches avatar_url into existing user state without a refetch.
    const updateAvatarUrl = (url: string | null) => {
        setUser((prev) => (prev ? { ...prev, avatar_url: url } : prev));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                updateAvatarUrl,
                isLoading,
            }}
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
