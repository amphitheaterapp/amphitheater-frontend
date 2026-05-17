import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // sends cookies automatically with every request
    headers: {
        'Content-Type': 'application/json',
    },
});

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

export default api;
