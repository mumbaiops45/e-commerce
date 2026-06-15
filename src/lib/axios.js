import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            // Clear persisted auth state so the UI reflects reality
            try {
                localStorage.removeItem("hgs-auth");
            } catch {}
            // Only redirect if we're in the browser and not already on auth page
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
                window.location.href = "/auth";
            }
        }
        return Promise.reject(error);
    }
);

export default api;