// frontend/src/components/admin/AdminSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Package, ShoppingBag, DollarSign, MessageSquare, LogOut, X } from "lucide-react";

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
    <div className="flex flex-col">
      {/* Header (bouton fermeture sur mobile) */}
      {isMobile && (
        <div className="p-5 border-b relative">
          <button
            className="absolute top-0 right-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={idx}
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

      {/* Bouton Déconnexion */}
      <div className="p-4 border-t">
        <button
          className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          onClick={() => {
            console.log("Déconnexion");
            if (isMobile) onClose();
          }}
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
