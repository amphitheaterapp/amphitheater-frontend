// lib/axios.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // sends cookies automatically with every request
    headers: {
        'Content-Type': 'application/json',
    },
});

// put csrf tokens from cookie to headers
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const csrfToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken="))
            ?.split("=")[1];

        if (csrfToken) {
            config.headers["X-CSRFToken"] = csrfToken;
        }
    }

    return config;
});

// Skip refresh on these routes.
const AUTH_EXEMPT_PATHS = [
    '/api/v1/auth/login/',
    '/api/v1/auth/register/',
    '/api/v1/auth/refresh/',
    '/api/v1/auth/send-otp/',
    '/api/v1/auth/verify-otp/',
];

interface RetriableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Shared refresh call. Without this, two requests failing at the same
// time would each try to refresh, the second one would use a token the
// first one already used up, and fail for no real reason.
let refreshPromise: Promise<void> | null = null;

function isExemptPath(url?: string): boolean {
    if (!url) return false;
    return AUTH_EXEMPT_PATHS.some((path) => url.includes(path));
}

function isInsideAppShell(): boolean {
    if (typeof window === "undefined") return false;
    return window.location.pathname.startsWith("/app/");
}

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableConfig | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            isExemptPath(originalRequest.url) ||
            originalRequest._retry ||
            !isInsideAppShell()
        ) {
            return Promise.reject(error);
        }

        // 401 happens before the route's own code runs
        originalRequest._retry = true;

        if (!refreshPromise) {
            refreshPromise = api
                .post('/api/v1/auth/refresh/')
                .then(() => undefined)
                .catch((refreshError) => {
                    if (
                        typeof window !== "undefined" &&
                        window.location.pathname !== "/login"
                    ) {
                        window.location.href = "/login";
                    }
                    throw refreshError;
                })
                .finally(() => {
                    refreshPromise = null;
                });
        }

        try {
            await refreshPromise;
            return api(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);

export default api;