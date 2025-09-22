import api from "../utils/axios";

export const createNegotiation = async (productId, message) => {
  try {
    const response = await api.post(
      `/negotiations`,
      { productId, message }
    );
    return response.data.negotiation;
  } catch (error) {
    console.error("Erreur lors de la création de la négociation.", error);
    throw new Error("Erreur lors de la création de la négociation.");
  }
};

export const getNegotiations = async () => {
  try {
    const response = await api.get(`/negotiations/me`);
    return response.data.negotiations;
  } catch (error) {
    console.error("Erreur lors de la récupération des négociations.", error);
    throw new Error("Erreur lors de la récupération des négociations.");
  }
};

export const sendMessage = async (negotiationId, text) => {
  try {
    const response = await api.post(
      `/negotiations/${negotiationId}/message`,
      { text }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message.", error);
    throw new Error("Erreur lors de l'envoi du message.");
  }
};

export const confirmAgreement = async (negotiationId, agreedPrice, agreedQuantity) => {
  try {
    const response = await api.post(
      `/negotiations/${negotiationId}/confirm`,
      { agreedPrice, agreedQuantity }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la confirmation de l'accord.", error);
    throw new Error("Erreur lors de la confirmation de l'accord.");
  }
};
