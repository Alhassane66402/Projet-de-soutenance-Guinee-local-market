// src/layouts/MainLayout.jsx

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import Footer from "../components/Footer";

export default function MainLayout() {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <BottomNav />
      {/* ✅ Footer uniquement si on n'est pas sur AdminDashboard */}
      {!isAdminDashboard && <Footer />}
    </div>
  );
}
