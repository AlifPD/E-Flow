import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { clearAuth } from "../utils/auth";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Swal.fire("Session Expired", "Please log in again", "error").then(clearAuth);
        }
        return Promise.reject(error);
    }
);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default api;