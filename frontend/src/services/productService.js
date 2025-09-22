// src/services/productService.js
import api from "../utils/axios"; // Importe l'instance Axios configurée

const API_PRODUCTS_URL = "/products"; // Chemin de base pour les produits
const API_ADMIN_URL = "/admin"; // Chemin de base pour les routes d'administration

/**
 * Récupère tous les produits d'un producteur spécifique.
 * @param {string} producerId - L'ID du producteur.
 * @returns {Array} La liste des produits.
 */
export const getMyProducts = async (producerId) => {
  try {
    const response = await api.get(API_PRODUCTS_URL, {
      params: { producer: producerId },
    });
    return response.data.products;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors de la récupération des produits";
  }
};

/**
 * Crée un nouveau produit.
 * @param {FormData} productData - Les données du produit, y compris l'image.
 * @returns {object} Les données du produit créé.
 */
export const createProduct = async (productData) => {
  try {
    const response = await api.post(API_PRODUCTS_URL, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors de la création du produit";
  }
};

/**
 * Met à jour un produit existant.
 * @param {string} productId - L'ID du produit à mettre à jour.
 * @param {FormData} productData - Les données de mise à jour.
 * @returns {object} Les données du produit mis à jour.
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(
      `${API_PRODUCTS_URL}/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors de la mise à jour du produit";
  }
};

/**
 * Supprime un produit (utilisée par le producteur et l'administrateur).
 * @param {string} productId - L'ID du produit à supprimer.
 * @returns {object} Le message de confirmation.
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`${API_PRODUCTS_URL}/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors de la suppression du produit";
  }
};

/**
 * Met à jour la disponibilité d'un produit.
 * @param {string} productId - L'ID du produit.
 * @param {boolean} isUnavailable - Le nouvel état de disponibilité.
 * @returns {object} Le produit mis à jour.
 */
export const updateProductAvailability = async (productId, isUnavailable) => {
  try {
    const response = await api.patch(
      `${API_PRODUCTS_URL}/${productId}/availability`,
      { isUnavailable }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors de la mise à jour de la disponibilité";
  }
};


/**
 * Récupère tous les produits validés et disponibles pour le client.
 * C'est la fonction à utiliser pour la page d'accueil et la liste des produits.
 * @returns {Array} La liste des produits validés et non bloqués.
 */
export const fetchValidatedProducts = async () => {
  try {
    const response = await api.get(`${API_PRODUCTS_URL}/validated`);
    // ✅ Renvoie l'objet entier, comme votre API le fait
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la récupération des produits";
  }
};

/**
 * Récupère les détails d'un produit par son ID.
 * @param {string} productId - L'ID du produit.
 * @returns {object} Le produit.
 */
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`${API_PRODUCTS_URL}/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors de la récupération des détails du produit";
  }
};

// ---
// ✅ Fonctions pour l'administrateur
// ---

/**
 * Récupère tous les produits (y compris non validés).
 * @returns {Array} La liste de tous les produits.
 */
export const getAllProducts = async () => {
  try {
    const response = await api.get(`${API_ADMIN_URL}/products`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors de la récupération de tous les produits";
  }
};


/**
 * Valide un produit.
 * @param {string} productId - L'ID du produit à valider.
 * @returns {object} Le produit mis à jour.
 */
export const validateProduct = async (productId) => {
  try {
    const response = await api.put(`${API_ADMIN_URL}/validate-product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors de la validation du produit";
  }
};

/**
 * Refuse un produit.
 * @param {string} productId - L'ID du produit à refuser.
 * @returns {object} Le produit mis à jour.
 */
export const refuseProduct = async (productId) => {
  try {
    const response = await api.put(`${API_ADMIN_URL}/refuse-product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors du refus du produit";
  }
};

/**
 * Supprime un produit refusé.
 * @param {string} productId - L'ID du produit refusé à supprimer.
 * @returns {object} Le message de confirmation.
 */
export const deleteRefusedProduct = async (productId) => {
  try {
    const response = await api.delete(`${API_ADMIN_URL}/delete-product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur lors de la suppression du produit refusé";
  }
};