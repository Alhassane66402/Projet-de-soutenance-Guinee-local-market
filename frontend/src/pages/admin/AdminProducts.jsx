// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from "react";
import { getAllProducts, getProductById, deleteRefusedProduct } from "../../services/productService"; // ✅ N'oubliez pas d'importer la fonction
import { useApp } from "../../hooks/useApp";
import { Loader2, Eye, Trash2 } from "lucide-react";
import ProductDetailModal from "../../components/admin/ProductDetailModal";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const { token } = useApp();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data?.products || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des produits:", err);
      setError("Impossible de charger les produits. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId) => {
    setModalLoading(true);
    try {
      const product = await getProductById(productId);
      setSelectedProduct(product);
      setShowModal(true);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des détails du produit:",
        err
      );
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  useEffect(() => {
    if (!Array.isArray(products)) {
      return;
    }
    let currentFiltered = [];
    if (activeTab === "all") {
      currentFiltered = products;
    } else {
      currentFiltered = products.filter(
        (product) => product.status === activeTab
      );
    }
    setFilteredProducts(currentFiltered);
  }, [products, activeTab]);

  const handleProductUpdate = () => {
    fetchProducts();
    handleCloseModal();
  };

  const handleViewDetails = (productId) => {
    fetchProductDetails(productId);
  };

  // ✅ Utilisation de la nouvelle fonction pour la suppression
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit refusé ? Cette action est irréversible.")) {
      try {
        await deleteRefusedProduct(productId);
        console.log(`Produit avec l'ID: ${productId} supprimé avec succès.`);
        fetchProducts(); // Rafraîchit la liste des produits
      } catch (err) {
        console.error("Erreur lors de la suppression du produit:", err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const tabs = [
    { id: "all", label: "Tous" },
    { id: "en_attente", label: "En attente" },
    { id: "valide", label: "Validés" },
    { id: "refuse", label: "Refusés" },
  ];

  return (
    <div className=" mt-18 md:mt-20 lg:mt-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Gestion des Produits
      </h1>
      <p className="text-gray-600 mb-6">
        Examinez, validez ou rejetez les produits proposés par les producteurs.
      </p>

      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 -mb-px text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin text-green-500" size={48} />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponibilité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.image && (
                        <img
                          src={`http://localhost:3000${product.image}`}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded-md"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.producer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.price} TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isUnavailable
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.isUnavailable ? "Indisponible" : "Disponible"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === "valide"
                            ? "bg-green-100 text-green-800"
                            : product.status === "en_attente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status === "valide"
                          ? "Validé"
                          : product.status === "en_attente"
                          ? "En attente"
                          : "Refusé"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Bouton pour voir les détails */}
                        <button
                          onClick={() => handleViewDetails(product._id)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={20} />
                        </button>

                        {/* ✅ NOUVEAU : Le bouton de suppression est maintenant conditionnel */}
                        {product.status === "refuse" && (
                            <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                                title="Supprimer le produit"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Aucun produit trouvé pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onUpdate={handleProductUpdate}
        />
      )}
    </div>
  );
};

export default AdminProducts;