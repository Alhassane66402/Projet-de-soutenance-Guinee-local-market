// src/services/authService.js
import api from "../utils/axios";

// ✅ Inscription
export const signupUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    const { token, user } = response.data;
    if (token) localStorage.setItem("token", token);
    return { user, token };
  } catch (error) {
    throw error.response?.data?.message || "Erreur d'inscription";
  }
};

// ✅ Connexion
export const loginUser = async ({ email, password }) => {
  try {
    const response = await api.post("/auth/login", { email, password }); // ✅ envoie email + password
    const { token, user } = response.data;
    if (token) localStorage.setItem("token", token);
    return { user, token };
  } catch (error) {
    throw error.response?.data?.message || "Erreur de connexion";
  }
};

// ✅ Récupération profil utilisateur
export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur de récupération du profil";
  }
};

// ✅ Mise à jour profil utilisateur
export const updateUserProfile = async (updatedData) => {
  try {
    const response = await api.put("/auth/me", updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Erreur de mise à jour du profil";
  }
};

// ✅ Déconnexion
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout"); // optionnel, si backend gère la session
  } catch (error) {
    console.warn("Erreur lors de la déconnexion côté serveur (ignorée).");
  }
  localStorage.removeItem("token");
};
