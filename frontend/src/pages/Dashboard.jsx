import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Clock, User, Package, MessageSquare } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Commandes", value: 5, icon: ShoppingBag, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Favoris", value: 3, icon: Heart, color: "text-red-600", bgColor: "bg-red-100" },
    { label: "En attente", value: 2, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  ];

  const recentOrders = [
    { id: "#12345", date: "12 Nov 2023", status: "Livré", total: "75 000 GNF" },
    { id: "#12346", date: "10 Nov 2023", status: "En cours", total: "45 000 GNF" },
    { id: "#12347", date: "5 Nov 2023", status: "Livré", total: "120 000 GNF" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
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
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Commandes récentes</h2>
              <Link to="/commandes" className="text-green-600 hover:underline">
                Voir tout
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Commande</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Statut</th>
                    <th className="text-left py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Livré" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 font-semibold">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/compte"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="bg-green-100 p-3 rounded-full mb-2">
                  <User className="text-green-600" size={24} />
                </div>
                <span className="font-medium">Profil</span>
              </Link>
              <Link
                to="/favoris"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="bg-red-100 p-3 rounded-full mb-2">
                  <Heart className="text-red-600" size={24} />
                </div>
                <span className="font-medium">Favoris</span>
              </Link>
              <Link
                to="/panier"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-2">
                  <ShoppingBag className="text-blue-600" size={24} />
                </div>
                <span className="font-medium">Panier</span>
              </Link>
              <Link
                to="/contact"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="bg-purple-100 p-3 rounded-full mb-2">
                  <MessageSquare className="text-purple-600" size={24} />
                </div>
                <span className="font-medium">Support</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Account Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Résumé du compte</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium">Mohamed Diallo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">mohamed@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Téléphone:</span>
                <span className="font-medium">+224 621 234 567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Membre depuis:</span>
                <span className="font-medium">Jan 2023</span>
              </div>
            </div>
            <Link
              to="/compte"
              className="block w-full text-center bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700 transition-colors"
            >
              Modifier le profil
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Package className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="font-medium">Commande #12346 passée</p>
                  <p className="text-sm text-gray-600">Il y a 2 jours</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Heart className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="font-medium">Produit ajouté aux favoris</p>
                  <p className="text-sm text-gray-600">Il y a 3 jours</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <User className="text-purple-600" size={16} />
                </div>
                <div>
                  <p className="font-medium">Profil mis à jour</p>
                  <p className="text-sm text-gray-600">Il y a 1 semaine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;