import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./hooks/useApp";

// Composants publics
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import Producers from "./pages/Producers"; // Page liste des producteurs
import ProducerProducts from "./pages/ProducerDetail"; // Page des produits d’un producteur

// Composants privés
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProducerDashboard from "./pages/ProducerDashboard";

// 🔒 Route privée
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useApp();

  if (!isLoggedIn) {
    return <Navigate to="/connexion" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirection selon le rôle
    if (user?.role === "client") return <Navigate to="/dashboard" />;
    if (user?.role === "producer") return <Navigate to="/producteur" />;
    return <Navigate to="/" />; // Redirection par défaut
  }

  return children;
};

// 🚫 Route publique protégée (empêche accès si connecté)
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <main className="flex-grow mb-8">
            <Routes>
              {/* ROUTES PUBLIQUES */}
              <Route path="/" element={<Home />} />
              <Route path="/produits" element={<Products />} />
              <Route path="/produit/:id" element={<ProductDetail />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/producteurs" element={<Producers />} />
              <Route path="/producers/:id" element={<ProducerDetail />} />
              <Route
                path="/producteur/:id/produits"
                element={<ProducerProducts />}
              />
              <Route
                path="/connexion"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/inscription"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route path="/recherche" element={<SearchResults />} />

              {/* ROUTES PRIVÉES */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute allowedRoles={["client"]}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/compte"
                element={
                  <PrivateRoute allowedRoles={["client", "producer", "admin"]}>
                    <Account />
                  </PrivateRoute>
                }
              />
              <Route
                path="/commandes"
                element={
                  <PrivateRoute allowedRoles={["client", "producer", "admin"]}>
                    <Orders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favoris"
                element={
                  <PrivateRoute allowedRoles={["client", "producer", "admin"]}>
                    <Wishlist />
                  </PrivateRoute>
                }
              />
              <Route
                path="/panier"
                element={
                  <PrivateRoute allowedRoles={["client", "producer", "admin"]}>
                    <Cart />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute allowedRoles={["client", "producer", "admin"]}>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* ROUTES PRODUCTEUR */}
              <Route
                path="/producteur"
                element={
                  <PrivateRoute allowedRoles={["producer"]}>
                    <ProducerDashboard />
                  </PrivateRoute>
                }
              />

              {/* ROUTES ADMIN */}
              <Route
                path="admin"
                element={
                  <PrivateRoute allowedRoles={["admin"]}>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<AdminDashboard />} /> {/* /admin */}
                <Route path="utilisateurs" element={<AdminUsers />} />{" "}
                {/* /admin/utilisateurs */}
              </Route>

              {/* REDIRECTION POUR ROUTE INCONNUE */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
