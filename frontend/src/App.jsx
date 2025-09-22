import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Composants publics
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Panier from "./pages/Panier.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Producers from "./pages/Producers.jsx";
import ProducerDetail from "./pages/ProducerDetail.jsx";

// Composants privés
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import NegotiationPage from "./pages/NegotiationPage.jsx"; // <-- Nouveau composant

// Composants Admin
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducers from "./pages/admin/AdminProducers.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminSales from "./pages/admin/AdminSales.jsx";
import AdminMessages from "./pages/admin/AdminMessages.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

// composants Producteur
import ProducerLayout from "./pages/producer/ProducerLayout.jsx";
import ProducerDashboard from "./pages/producer/ProducerDashboard.jsx";
import ProducerProducts from "./pages/producer/ProducerProducts.jsx";
import ProducerOrders from "./pages/producer/ProducerOrders.jsx";
import ProducerSales from "./pages/producer/ProducerSales.jsx";

// Hooks et context
import { useApp } from "./hooks/useApp.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

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
              <Route index element={<Home />} />
              <Route path="produits" element={<Products />} />
              <Route path="a-propos" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="panier" element={<Panier />} />
              <Route path="producteurs" element={<Producers />} />
              <Route path="/producteurs/:id" element={<ProducerDetail />} />
              <Route
                path="connexion"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="inscription"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
            </Route>
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
            <Route
              path="/negotiations"
              element={
                <PrivateRoute allowedRoles={["client", "producer"]}>
                  <NegotiationPage />
                </PrivateRoute>
              }
            />

            {/* ROUTES PRODUCTEUR - Structure imbriquée */}
            <Route
              path="/producteur/*"
              element={
                <PrivateRoute allowedRoles={["producer"]}>
                  <ProducerLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<ProducerDashboard />} />
              <Route path="produits" element={<ProducerProducts />} />
              <Route path="commandes" element={<ProducerOrders />} />
              <Route path="ventes" element={<ProducerSales />} />
              <Route path="negotiations" element={<NegotiationPage />} />
            </Route>

            {/* ROUTES ADMIN - Structure imbriquée */}
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
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
