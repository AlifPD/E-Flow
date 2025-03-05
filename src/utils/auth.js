import api from "../services/api";

export const clearAuth = async () => {
    try {
        await api.post("/auth/logout");
    } catch (error) {
        console.error("Logout failed", error);
    }
    localStorage.removeItem("roles");
    localStorage.removeItem("token");
    window.location.href = "/login";
};
