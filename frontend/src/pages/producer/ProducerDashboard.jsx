// src/pages/ProducerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Star,
  Loader,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Supposez que ce service existe pour simuler un appel API
// Vous devriez le remplacer par un appel API réel vers votre backend
const fetchDashboardData = async () => {
  // Simuler un délai d'API de 1.5s
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simuler une réponse de l'API
  const response = {
    totalSales: "5,450 TND",
    pendingOrders: 12,
    totalProducts: 35,
    averageRating: "4.8/5",
    recentOrders: [
      { id: 1, product: "Miel de montagne", customer: "Alice L.", date: "15/09/2025" },
      { id: 2, product: "Huile d'olive extra vierge", customer: "Bob M.", date: "14/09/2025" },
      { id: 3, product: "Fromage de chèvre", customer: "Charlie T.", date: "13/09/2025" },
    ],
    producerName: "Ahmed", // Nom du producteur connecté
  };

  return response;
};

const ProducerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError("Échec du chargement des données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const cardItems = dashboardData
    ? [
        {
          id: 1,
          title: "Ventes totales",
          value: dashboardData.totalSales,
          icon: <DollarSign size={48} />,
          color: "bg-green-500",
          link: "/producer/sales",
        },
        {
          id: 2,
          title: "Commandes en attente",
          value: dashboardData.pendingOrders,
          icon: <ShoppingCart size={48} />,
          color: "bg-blue-500",
          link: "/producer/orders",
        },
        {
          id: 3,
          title: "Nombre de produits",
          value: dashboardData.totalProducts,
          icon: <Package size={48} />,
          color: "bg-yellow-500",
          link: "/producer/products",
        },
        {
          id: 4,
          title: "Avis clients",
          value: dashboardData.averageRating,
          icon: <Star size={48} />,
          color: "bg-purple-500",
          link: "/producer/reviews",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader size={64} className="animate-spin mb-4" />
        <p className="text-xl">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <AlertCircle size={64} className="mb-4" />
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-18 md:mt-20 lg:mt-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Tableau de bord Producteur
      </h1>
      <p className="text-gray-600 mb-8">
        Bienvenue, <span className="font-semibold text-gray-800">{dashboardData.producerName}</span>. Voici un aperçu rapide de vos activités.
      </p>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardItems.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className={`
              ${item.color} text-white
              p-6 rounded-lg shadow-lg
              flex flex-col items-center justify-center
              hover:shadow-xl transform hover:scale-105 transition-all
            `}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
            <p className="text-3xl font-bold">{item.value}</p>
          </Link>
        ))}
      </div>

      ---

      {/* Section Activité récente */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Activité récente</h2>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {dashboardData.recentOrders.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentOrders.map((order) => (
                <li key={order.id} className="py-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-lg font-medium text-gray-900">{order.product}</span>
                    <span className="text-sm text-gray-500">Client : {order.customer}</span>
                  </div>
                  <span className="text-sm text-gray-600">{order.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucune activité récente à afficher.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;