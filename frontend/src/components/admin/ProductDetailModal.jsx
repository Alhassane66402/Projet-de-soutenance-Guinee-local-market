// src/components/admin/ProductDetailModal.jsx
import React, { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { validateProduct, refuseProduct } from "../../services/productService";
import { useApp } from "../../hooks/useApp";

const ProductDetailModal = ({ product, onClose, onUpdate }) => {
  const { token } = useApp();
  const [localProduct, setLocalProduct] = useState(product);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    setLocalProduct(product);
  }, [product]);

  if (!localProduct) return null;

  // Fonction utilitaire pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Non disponible";
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy à HH:mm", { locale: fr });
  };

  // Fonction pour valider un produit
  const handleValidateProduct = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const updatedProductData = await validateProduct(localProduct._id, token);
      setLocalProduct(updatedProductData.product);
      if (onUpdate) {
        onUpdate(updatedProductData.product);
      }
    } catch (err) {
      console.error("Erreur lors de la validation du produit:", err);
      setUpdateError("Échec de la validation.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Fonction pour refuser un produit
  const handleRefuseProduct = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const updatedProductData = await refuseProduct(localProduct._id, token);
      setLocalProduct(updatedProductData.product);
      if (onUpdate) {
        onUpdate(updatedProductData.product);
      }
    } catch (err) {
      console.error("Erreur lors du refus du produit:", err);
      setUpdateError("Échec du refus.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
        <div className="flex justify-between items-start border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Détails du produit
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {updateError && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
            {updateError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
            {localProduct.image ? (
              <img
                src={`http://localhost:3000${localProduct.image}`}
                alt={localProduct.name}
                className="w-full max-h-96 object-contain rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-500">Aucune image</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              {localProduct.name}
            </h3>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-lg text-gray-900">
                {localProduct.description || "Aucune description fournie."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Prix</p>
                <p className="text-lg font-bold text-gray-900">
                  {localProduct.price} TND
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Catégorie</p>
                <p className="text-lg text-gray-900">
                  {localProduct.category || "Non spécifié"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <p className="text-lg font-bold">
                  {localProduct.status === "valide" && (
                    <span className="text-green-600">Validé</span>
                  )}
                  {localProduct.status === "en_attente" && (
                    <span className="text-yellow-600">En attente</span>
                  )}
                  {localProduct.status === "refuse" && (
                    <span className="text-red-600">Refusé</span>
                  )}
                </p>
              </div>

              {/* ✅ NOUVEAU : Affichage de la date de création */}
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Date de création
                </p>
                <p className="text-lg text-gray-900">
                  {formatDate(localProduct.createdAt)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Producteur</p>
              <p className="text-lg text-gray-900">
                {localProduct.producer.name}
              </p>
            </div>
            {/* ✅ Boutons d'action pour l'admin */}
            {localProduct.status === "en_attente" && (
              <div className="mt-6 pt-4 border-t flex justify-end space-x-4">
                <button
                  onClick={handleRefuseProduct}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    "Refuser"
                  )}
                </button>
                <button
                  onClick={handleValidateProduct}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    "Valider"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
