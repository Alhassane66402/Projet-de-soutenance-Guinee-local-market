import React from "react";
import { Link } from "react-router-dom";
import { User, DollarSign, Package, ShoppingBag, Truck, CheckCircle, MessageSquare } from "lucide-react";

const AdminDashboard = () => {
  // Stats spécifiques à l'administrateur
  const adminStats = [
    { label: "Utilisateurs", value: 125, icon: User, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Commandes", value: 45, icon: ShoppingBag, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Produits", value: 205, icon: Package, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  // Commandes récentes pour l'administrateur
  const recentOrders = [
    { id: "#12348", client: "Fatoumata Sylla", status: "En cours", total: "150 000 GNF" },
    { id: "#12347", client: "Lamine Barry", status: "Livré", total: "85 000 GNF" },
    { id: "#12346", client: "Aissatou Diallo", status: "En attente", total: "250 000 GNF" },
    { id: "#12345", client: "Alpha Oumar", status: "Livré", total: "40 000 GNF" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord Admin</h1>
      
      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color} mr-4`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Recent Orders for Admin */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Dernières commandes</h2>
              <Link to="/admin/commandes" className="text-green-600 hover:underline">
                Gérer les commandes
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Commande
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Livré"
                            ? "bg-green-100 text-green-800"
                            : order.status === "En cours"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions for Admin */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/produits"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="bg-purple-100 p-3 rounded-full mb-2">
                  <Package className="text-purple-600" size={24} />
                </div>
                <span className="font-medium text-center">Gérer les produits</span>
              </Link>
              <Link
                to="/admin/utilisateurs"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-2">
                  <User className="text-blue-600" size={24} />
                </div>
                <span className="font-medium text-center">Gérer les utilisateurs</span>
              </Link>
              <Link
                to="/admin/ventes"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="bg-red-100 p-3 rounded-full mb-2">
                  <DollarSign className="text-red-600" size={24} />
                </div>
                <span className="font-medium text-center">Rapports de ventes</span>
              </Link>
              <Link
                to="/admin/messages"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="bg-yellow-100 p-3 rounded-full mb-2">
                  <MessageSquare className="text-yellow-600" size={24} />
                </div>
                <span className="font-medium text-center">Messages</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Admin Profile Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Résumé du compte</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium">Admin Mohamed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rôle:</span>
                <span className="font-medium text-red-500">Administrateur</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">admin@guineemarket.com</span>
              </div>
            </div>
            <Link
              to="/admin/profile"
              className="block w-full text-center bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700 transition-colors"
            >
              Modifier le profil
            </Link>
          </div>

          {/* Recent Admin Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Package className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="font-medium">Produit "Riz local" ajouté</p>
                  <p className="text-sm text-gray-600">Il y a 3 minutes</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Truck className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-medium">Commande #12348 expédiée</p>
                  <p className="text-sm text-gray-600">Il y a 15 minutes</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <CheckCircle className="text-yellow-600" size={16} />
                </div>
                <div>
                  <p className="font-medium">Utilisateur "Fatou" validé</p>
                  <p className="text-sm text-gray-600">Il y a 35 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;