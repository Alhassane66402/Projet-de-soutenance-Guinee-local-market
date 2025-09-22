// src/pages/producer/ProducerOrders.jsx
import React, { useState, useEffect } from "react";
import { getMyOrders } from "../../services/orderService";
import { useApp } from "../../hooks/useApp";
import { Loader2 } from "lucide-react";
import OrderList from "../../components/producer/OrderList";
import OrderStatusTabs from "../../components/producer/OrderStatusTabs";

const ProducerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const { token } = useApp();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders();
      // ✅ Correction 1: Utilisation de l'opérateur de chaînage optionnel et d'un fallback
      // pour s'assurer que 'orders' est toujours un tableau.
      setOrders(data?.orders || []); 
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes:", err);
      setError("Impossible de charger les commandes. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  useEffect(() => {
    // ✅ Correction 2: Vérification explicite avant de filtrer.
    // Cela empêche l'erreur si 'orders' est undefined pour une raison quelconque.
    if (!Array.isArray(orders)) {
        return; 
    }
    
    // Filtrer les commandes en fonction de l'onglet actif
    let currentFiltered = [];
    if (activeTab === "pending") {
      currentFiltered = orders.filter((order) => order.status === "en_attente");
    } else if (activeTab === "processed") {
      currentFiltered = orders.filter((order) => order.status === "traitee");
    } else if (activeTab === "canceled") {
      currentFiltered = orders.filter((order) => order.status === "annulee");
    }
    setFilteredOrders(currentFiltered);
  }, [orders, activeTab]);

  return (
    <div className="mt-18 md:mt-20 lg:mt-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Mes Commandes</h1>
      <p className="text-gray-600 mb-6">
        Gérez et suivez l'état de vos commandes.
      </p>

      <OrderStatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin text-green-500" size={48} />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-4">{error}</div>
      ) : (
        <OrderList orders={filteredOrders} />
      )}
    </div>
  );
};

export default ProducerOrders;