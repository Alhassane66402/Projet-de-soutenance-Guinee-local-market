// src/services/producerService.js
import api from "../utils/axios";

// 🔹 Récupérer tous les producteurs vérifiés
export const fetchValidatedProducers = async () => {
  try {
    const response = await api.get("/producers");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la récupération des producteurs";
  }
};

// ✅ Récupérer un producteur par ID
export const fetchProducerById = async (id) => {
  const response = await api.get(`/producers/${id}`);
  return response.data;
};

// 🔹 Récupérer les produits d’un producteur
export const fetchProductsByProducer = async (producerId) => {
  try {
    const response = await api.get(`/products/producer/${producerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la récupération des produits";
  }
};
