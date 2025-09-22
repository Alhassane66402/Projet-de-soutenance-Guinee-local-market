// src/components/producer/ProductDetailModal.jsx
import React, { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { updateProductAvailability } from "../../services/productService";
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

  const handleToggleAvailability = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const newAvailability = !localProduct.isUnavailable;
      const updatedProduct = await updateProductAvailability(
        localProduct._id,
        newAvailability,
        token
      );
      setLocalProduct(updatedProduct.product);
      
      // ✅ Correction : Vérifier que la fonction onUpdate existe avant de l'appeler.
      if (onUpdate) {
        onUpdate(updatedProduct.product); // Notifie le parent du changement.
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la disponibilité:", err);
      setUpdateError("Échec de la mise à jour.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
        <div className="flex justify-between items-start border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Détails du produit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
            <h3 className="text-2xl font-semibold text-gray-900">{localProduct.name}</h3>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-lg text-gray-900">{localProduct.description || 'Aucune description fournie.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Prix</p>
                <p className="text-lg font-bold text-gray-900">{localProduct.price} TND</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Catégorie</p>
                <p className="text-lg text-gray-900">{localProduct.category || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <p className="text-lg font-bold">
                  {localProduct.status === "valide" && <span className="text-green-600">Validé</span>}
                  {localProduct.status === "en_attente" && <span className="text-yellow-600">En attente</span>}
                  {localProduct.status === "refuse" && <span className="text-red-600">Refusé</span>}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Disponibilité</p>
                <p className="text-lg font-bold">
                  {localProduct.isUnavailable ? (
                    <span className="text-red-600">Indisponible</span>
                  ) : (
                    <span className="text-green-600">Disponible</span>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">Gérer la disponibilité</p>
          <button
            onClick={handleToggleAvailability}
            disabled={isUpdating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              localProduct.isUnavailable
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            {isUpdating ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <span>
                {localProduct.isUnavailable ? "Rendre disponible" : "Rendre indisponible"}
              </span>
            )}
          </button>
        </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ProductDetailModal;