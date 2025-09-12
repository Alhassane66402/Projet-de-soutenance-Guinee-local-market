// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";
import { User, Package, ShoppingBag, DollarSign, Sidebar, X } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar"; // ton composant sidebar
import Footer from "../../components/Footer";

// Données statiques
const adminStats = [
  { label: "Utilisateurs", value: 125, icon: User, color: "text-blue-600", bgColor: "bg-blue-100" },
  { label: "Commandes", value: 45, icon: ShoppingBag, color: "text-green-600", bgColor: "bg-green-100" },
  { label: "Produits", value: 205, icon: Package, color: "text-purple-600", bgColor: "bg-purple-100" },
];

const recentOrders = [
  { id: "#12348", client: "Fatoumata Sylla", status: "En cours", total: "150 000 GNF" },
  { id: "#12347", client: "Lamine Barry", status: "Livré", total: "85 000 GNF" },
  { id: "#12346", client: "Aissatou Diallo", status: "En attente", total: "250 000 GNF" },
  { id: "#12345", client: "Alpha Oumar", status: "Livré", total: "40 000 GNF" },
];

const AdminDashboard = () => {
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
        <AdminSidebar isMobile={true} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:block w-64 fixed top-15 left-0 h-full bg-white shadow-lg z-30">
        <AdminSidebar />
      </div>

      {/* Bouton toggle mobile */}
      {!isSidebarOpen && (
        <button
          className="fixed top-14 left-4 z-40 lg:hidden p-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors cursor-pointer"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Sidebar size={20} />
        </button>
      )}

      {/* Contenu principal */}
      <main className="flex-1 ml-0 lg:ml-64 px-4 py-8 md:p-8 overflow-y-auto space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Tableau de bord Admin</h1>

        {/* Statistiques */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {adminStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color} mr-4`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                  <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Dernières commandes */}
        <section className="overflow-x-auto bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold">Dernières commandes</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">{order.client}</td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Livré"
                          ? "bg-green-100 text-green-800"
                          : order.status === "En cours"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default AdminDashboard;
