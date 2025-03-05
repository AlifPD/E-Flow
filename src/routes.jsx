import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    console.log(`TOKEN IS ${token}`);

    return token ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;