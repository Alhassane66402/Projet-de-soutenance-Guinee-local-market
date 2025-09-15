import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Composants publics
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Producers from "./pages/Producers";
import ProducerDetail from "./pages/ProducerDetail"; // Correction: import ajouté

// Composants privés
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducers from "./pages/admin/AdminProducers"; // Ajout des autres pages admin
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSales from "./pages/admin/AdminSales";
import AdminMessages from "./pages/admin/AdminMessages";
import ProducerDashboard from "./pages/ProducerDashboard";
import { useApp } from "./hooks/useApp";
import { AppProvider } from "./context/AppContext";
import MainLayout from "./layouts/MainLayout";
import AdminUsers from "./pages/admin/AdminUsers";

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
    if (user?.role === "admin") return <Navigate to="/admin/" />;
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow mb-8">
          <Routes>
            {/* ROUTES PUBLIQUES */}
            <Route path="/" element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/produits" element={<Products />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/producteurs" element={<Producers />} />
              <Route path="/producteur/:id" element={<ProducerDetail />} />{" "}
              {/* Correction: chemin cohérent */}
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

            {/* ROUTES ADMIN - Structure corrigée */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="utilisateurs" element={<AdminUsers />} />
              <Route path="producteurs" element={<AdminProducers />} />
              <Route path="produits" element={<AdminProducts />} />
              <Route path="commandes" element={<AdminOrders />} />
              <Route path="ventes" element={<AdminSales />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>

            {/* REDIRECTION POUR ROUTE INCONNUE */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
