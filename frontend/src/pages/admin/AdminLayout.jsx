// src/pages/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { X, User, Package, ShoppingBag, DollarSign, MessageSquare, LogOut, Sidebar } from "lucide-react";
import Footer from "../../components/Footer";

const AdminSidebar = ({ isMobile = false, onClose = () => {} }) => {
  const location = useLocation();

  const menuItems = [
    { label: "Tableau de bord", path: "/admin", icon: User },
    { label: "Producteurs", path: "/admin/producteurs", icon: User },
    { label: "Utilisateurs", path: "/admin/utilisateurs", icon: User },
    { label: "Produits", path: "/admin/produits", icon: Package },
    { label: "Commandes", path: "/admin/commandes", icon: ShoppingBag },
    { label: "Ventes", path: "/admin/ventes", icon: DollarSign },
    { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b relative">
        {isMobile && (
          <button
            className="absolute top-2 right-4 p-1 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-green-100 font-semibold text-green-700"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
              onClick={isMobile ? onClose : undefined}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          className="w-full flex items-center bg-red-100 justify-center gap-3 py-2 rounded-lg text-red-600 hover:bg-red-200 transition-colors"
          onClick={() => console.log("Déconnexion")}
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <div
        className={`fixed top-12 left-0 w-64 h-full bg-white shadow-lg z-50 lg:hidden overflow-y-auto transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar isMobile onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:block w-64 fixed top-2 left-0 h-full bg-white shadow-lg z-30">
        <AdminSidebar />
      </div>

      {/* Bouton toggle mobile */}
      {!isSidebarOpen && (
        <button
          className="fixed top-14 left-4 z-40 lg:hidden p-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors cursor-pointer"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Sidebar size={20} />
        </button>
      )}

      {/* Contenu principal */}
      <main className="flex-1 ml-0 lg:ml-64 px-4 py-8 md:p-8 overflow-y-auto">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default AdminLayout;
