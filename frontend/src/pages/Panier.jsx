import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useApp } from "../hooks/useApp";
import { createNegotiation } from "../services/negotiationService";
import { toast } from "react-toastify";

export default function Panier() {
  const { cart, removeFromCart, updateQuantity, isLoggedIn, clearCart } = useApp();
  const navigate = useNavigate();
  const [isNegotiating, setIsNegotiating] = useState(false);

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };
  
  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  // ✅ Nouvelle fonction pour gérer la création des négociations
  const handleStartNegotiation = async () => {
    if (!isLoggedIn) {
      toast.error("Veuillez vous connecter pour démarrer une négociation.");
      navigate("/connexion");
      return;
    }

    setIsNegotiating(true);
    try {
      // Regrouper les produits par producteur
      const productsByProducer = cart.reduce((acc, item) => {
        const producerId = item.producer;
        if (!acc[producerId]) {
          acc[producerId] = [];
        }
        acc[producerId].push(item);
        return acc;
      }, {});

      // Créer une négociation pour chaque produit de chaque producteur
      const negotiationPromises = Object.values(productsByProducer).flatMap(
        (products) =>
          products.map((product) =>
            createNegotiation(product._id, `Bonjour, je suis intéressé(e) par votre produit "${product.name}" en quantité de ${product.quantity} et souhaite discuter du prix et de la disponibilité.`)
          )
      );

      await Promise.all(negotiationPromises);
      
      toast.success("Négociations démarrées avec succès !");
      clearCart(); // Vider le panier après le lancement des négociations
      navigate("/negotiations"); // Rediriger vers la page de négociations

    } catch (error) {
      toast.error("Erreur lors du démarrage des négociations.");
      console.error("Erreur de négociation:", error);
    } finally {
      setIsNegotiating(false);
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-xl shadow-lg border border-gray-200 max-w-lg mx-auto my-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
        <p className="text-gray-600 mb-4">
          Explorez nos produits locaux et ajoutez-y vos favoris !
        </p>
        <Link
          to="/produits"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          Continuer mes achats
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto my-12 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">Mon Panier</h2>
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 rounded-lg border border-gray-200 bg-gray-50"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {item.price.toFixed(2)} GNF / unité
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                  className="p-2 text-gray-600 hover:text-white hover:bg-red-500 transition-colors rounded-full"
                >
                  <Minus size={20} />
                </button>
                <span className="font-medium text-xl w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                  className="p-2 text-gray-600 hover:text-white hover:bg-green-600 transition-colors rounded-full"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0">
                <span className="text-xl font-bold text-green-600">
                  {(item.price * item.quantity).toFixed(2)} GNF
                </span>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-gray-400 hover:text-red-600 transition-colors mt-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1 mt-8 lg:mt-0 p-6 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Résumé de la commande</h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Sous-total</span>
              <span>{subtotal.toFixed(2)} GNF</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Livraison</span>
              <span>{shipping.toFixed(2)} GNF</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-xl border-t border-gray-300 pt-4 mt-4">
              <span>Total</span>
              <span>{total.toFixed(2)} GNF</span>
            </div>
          </div>
          <button 
            onClick={handleStartNegotiation} 
            disabled={isNegotiating || !isLoggedIn}
            className="mt-6 w-full py-4 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition-colors transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNegotiating ? "Démarrage des négociations..." : "Démarrer la négociation"}
          </button>
          {!isLoggedIn && (
            <p className="mt-2 text-center text-sm text-red-500">
              Veuillez vous connecter pour négocier.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
