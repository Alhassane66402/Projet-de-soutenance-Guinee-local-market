import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Panier from "./pages/Panier";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { useApp } from "./hooks/useApp";
import { AppProvider } from "./context/AppContext";

// Composant pour protéger les routes selon le rôle
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useApp();

  if (!isLoggedIn) return <Navigate to="/connexion" />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirection selon le rôle
    if (user?.role === "client") return <Navigate to="/dashboard" />;
    if (user?.role === "admin") return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="produits" element={<Products />} />
            <Route path="a-propos" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="panier" element={<Panier />} />
            <Route path="connexion" element={<Login />} />
            <Route path="inscription" element={<Register />} />
            <Route path="profile" element={<Profile />} />

            {/* Dashboard client */}
            <Route
              path="dashboard"
              element={
                <PrivateRoute allowedRoles={["client"]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Dashboard admin */}
            <Route
              path="admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
