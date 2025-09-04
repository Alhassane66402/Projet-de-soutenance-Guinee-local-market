// src/services/productService.js
import api from '../utils/axios';

export const getProducts = async () => {
    try {
        const response = await api.get('/produits');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
    }
};

export const getProductDetails = async (id) => {
    try {
        const response = await api.get(`/produits/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch product with id ${id}:`, error);
        throw error;
    }
};

// ... autres fonctions pour créer, mettre à jour, supprimer des produits