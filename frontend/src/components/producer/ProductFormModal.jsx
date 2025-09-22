// src/components/producer/ProductFormModal.jsx
import React, { useState, useEffect } from "react";
import { X, Save, Loader } from "lucide-react";
import { createProduct, updateProduct } from "../../services/productService";
import { useApp } from "../../hooks/useApp";

const ProductFormModal = ({ product, onClose, onSuccess }) => {
  const isEditing = !!product;
  const { token } = useApp();

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    image: null,
    isUnavailable: product?.isUnavailable || false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: null,
        isUnavailable: product.isUnavailable,
      });
    }
  }, [isEditing, product]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : (type === "checkbox" ? checked : value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("isUnavailable", formData.isUnavailable);

    // ✅ CORRECTION CLÉ : Gérer l'image séparément.
    // Cette ligne ajoute le fichier lui-même à l'objet FormData.
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (isEditing) {
        await updateProduct(product._id, data, token);
      } else {
        await createProduct(data, token);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Erreur de l'API:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold">{isEditing ? "Modifier le produit" : "Ajouter un produit"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prix (TND)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="">Sélectionner</option>
                <option value="Fruits">Fruits</option>
                <option value="Légumes">Légumes</option>
                <option value="Artisanat">Artisanat</option>
                <option value="Textiles">Textiles</option>
                <option value="Autres">Autres</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input type="file" name="image" onChange={handleChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            </div>
            <div className="md:col-span-2 flex items-center mt-2">
              <input type="checkbox" name="isUnavailable" checked={formData.isUnavailable} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
              <label htmlFor="isUnavailable" className="ml-2 block text-sm font-medium text-gray-700">Marquer comme indisponible</label>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              {isEditing ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;