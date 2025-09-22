// src/pages/producer/ProducerProducts.jsx
import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader,
  XCircle,
  AlertCircle,
  Image,
  Eye,
} from "lucide-react";
import { useApp } from "../../hooks/useApp";
import ProductFormModal from "../../components/producer/ProductFormModal";
import ProductDetailModal from "../../components/producer/ProductDetailModal";
import { getMyProducts, deleteProduct } from "../../services/productService";

const ProducerProducts = () => {
  const { user, token } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchProducts = async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProducts(user._id);
      setProducts(data);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
      setError("Échec du chargement des produits. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user, token]);

 // ✅ Nouvelle fonction pour mettre à jour la liste des produits
  const handleUpdateProduct = (updatedProduct) => {
    setProducts(
      products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(productId, token);
        setProducts(products.filter((p) => p._id !== productId));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        setError("Échec de la suppression du produit.");
      }
    }
  };

  const handleOpenAddModal = () => {
    setCurrentProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (product) => {
    setCurrentProduct(product);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader size={48} className="animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-red-600">
        <XCircle size={48} className="mb-2" />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-18 md:mt-20 lg:mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Mes Produits</h1>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <PlusCircle size={20} />
          Ajouter un produit
        </button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <AlertCircle size={48} className="mb-4" />
          <p className="text-lg">Vous n'avez pas encore de produits.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                {/* ✅ Nouvelle colonne pour la disponibilité */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibilité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(products) && products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image ? (
                      <img src={`http://localhost:3000${product.image}`} alt={product.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <Image size={40} className="text-gray-300" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category || 'Non spécifié'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price} TND</td>
                  {/* ✅ Affichage de la pastille de disponibilité */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {product.isUnavailable ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-50 text-red-700">Indisponible</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700">Disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {product.status === "valide" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700">Validé</span>
                    )}
                    {product.status === "en_attente" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-50 text-yellow-700">En attente</span>
                    )}
                    {product.status === "refuse" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-50 text-red-700">Refusé</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleOpenDetailModal(product)}
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        title="Détails"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className={`p-2 rounded-md text-blue-600 hover:text-blue-900 transition-colors ${
                          product.status === "refuse"
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-blue-100 hover:bg-blue-200"
                        }`}
                        title={
                          product.status === "refuse"
                            ? "Produit refusé, impossible de modifier"
                            : "Modifier"
                        }
                        disabled={product.status === "refuse"}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormModalOpen && (
        <ProductFormModal
          product={currentProduct}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={fetchProducts}
        />
      )}
      
      {isDetailModalOpen && (
        <ProductDetailModal
          product={currentProduct}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdate={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default ProducerProducts;