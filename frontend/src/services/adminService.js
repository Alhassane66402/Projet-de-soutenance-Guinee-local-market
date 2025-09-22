import api from "../utils/axios";

// ✅ Récupérer tous les producteurs
export const fetchAllProducers = async () => {
  try {
    const response = await api.get("/admin/producers");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Erreur lors de la récupération des producteurs"
    );
  }
};

// ✅ Récupérer les producteurs en attente de validation
export const fetchPendingProducers = async () => {
  try {
    const response = await api.get("/admin/pending-producers");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Erreur lors de la récupération des producteurs en attente"
    );
  }
};

// ✅ Valider un producteur
export const validateProducer = async (producerId) => {
  try {
    const response = await api.put(`/admin/validate-producer/${producerId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Erreur lors de la validation du producteur"
    );
  }
};

// ✅ Supprimer un producteur
export const deleteProducer = async (producerId) => {
  try {
    const response = await api.delete(`/admin/delete-producer/${producerId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Erreur lors de la suppression du producteur"
    );
  }
};

// ✅ Récupérer tous les utilisateurs (producteurs et consommateurs)
export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Erreur lors de la récupération des utilisateurs"
    );
  }
};

// ✅ Récupérer le détail d'un utilisateur
export const fetchUserDetail = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Erreur lors de la récupération des détails de l'utilisateur"
    );
  }
};

// ✅ Bloquer ou débloquer un utilisateur
export const toggleBlockUser = async (userId) => {
  try {
    const response = await api.put(`/admin/users/${userId}/block`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors du blocage/déblocage";
  }
};


