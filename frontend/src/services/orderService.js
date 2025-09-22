// src/services/orderService.js
import api from "../utils/axios";

const API_ORDERS_URL = "/orders";

// Récupérer toutes les commandes d'un producteur
export const getMyOrders = async () => {
  const response = await api.get(`${API_ORDERS_URL}/my-orders`);
  return response.data;
};