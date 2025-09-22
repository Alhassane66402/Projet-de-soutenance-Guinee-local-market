// src/pages/Products.js
import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Filter,
  Grid,
  List,
  Star,
  Loader2,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { fetchValidatedProducts } from "../services/productService";
import { BASE_URL } from "../utils/axios";
import { useApp } from "../hooks/useApp";

// ✅ Importation des deux composants
import Notification from "../components/Notification";
import ModalAlert from "../components/ModalAlert";

// LISTES DE FILTRES PRÉDÉFINIES
const PREDEFINED_FILTERS = {
  categories: ["Fruits", "Légumes", "Céréales", "Produits Laitiers"],
  villes: ["Conakry", "Kindia", "Labé", "Boké"],
  regions: [
    "Boké",
    "Conakry",
    "Faranah",
    "Kankan",
    "Kindia",
    "Labé",
    "Mamou",
    "N'Zérékoré",
  ],
  producteurs: ["Producteur A", "Producteur B", "Ferme Y"],
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Utilisation du hook useApp pour accéder à la logique du panier et aux alertes
  const { addToCart, alert, setAlert } = useApp();

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const [minPrice, setMinPrice] = useState(
    minPriceParam ? Number(minPriceParam) : 0
  );
  const [maxPrice, setMaxPrice] = useState(
    maxPriceParam ? Number(maxPriceParam) : 100000
  );
  const [showFilters, setShowFilters] = useState(false);

  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `${BASE_URL}${path}`;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchValidatedProducts();
        if (response && Array.isArray(response.data)) {
          setProducts(response.data);
          const prices = response.data.map((p) => p.price);
          if (prices.length > 0) {
            const initialMaxPrice = Math.max(...prices);
            if (!maxPriceParam) {
              setMaxPrice(initialMaxPrice);
            }
          }
        } else {
          setError("Le format des données de l'API est incorrect.");
          setProducts([]);
        }
      } catch (err) {
        console.error("Erreur de chargement des produits :", err);
        setError(
          "Impossible de charger les produits. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categoryParam = searchParams.get("category");
  const cityParam = searchParams.get("city");
  const regionParam = searchParams.get("region");
  const producerParam = searchParams.get("producer");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const isInCategory =
        !categoryParam ||
        product.category?.toLowerCase() === categoryParam.toLowerCase();
      const isInCity =
        !cityParam ||
        product.producer?.city?.toLowerCase() === cityParam.toLowerCase();
      const isInRegion =
        !regionParam ||
        product.producer?.region?.toLowerCase() === regionParam.toLowerCase();
      const isInProducer =
        !producerParam ||
        product.producer?.name?.toLowerCase() === producerParam.toLowerCase();
      const isInPriceRange =
        product.price >= (minPriceParam ? Number(minPriceParam) : 0) &&
        product.price <= (maxPriceParam ? Number(maxPriceParam) : Infinity);

      return (
        isInCategory && isInCity && isInRegion && isInProducer && isInPriceRange
      );
    });
  }, [
    products,
    categoryParam,
    cityParam,
    regionParam,
    producerParam,
    minPriceParam,
    maxPriceParam,
  ]);

  // ✅ Logique de panier simplifiée
  const handleAddToCart = (product) => {
    // La validation est maintenant gérée par le hook useApp.
    // Il suffit d'appeler la fonction et le hook gérera les messages.
    addToCart(product, 1);
  };

  const handleFilterChange = (event, type) => {
    const value = event.target.value;
    const newSearchParams = new URLSearchParams(searchParams);

    if (value === "all") {
      newSearchParams.delete(type);
    } else {
      newSearchParams.set(type, value);
    }

    setSearchParams(newSearchParams);
  };

  const handlePriceChange = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("minPrice", minPrice);
    newSearchParams.set("maxPrice", maxPrice);
    setSearchParams(newSearchParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-green-500" size={64} />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 text-lg mt-10">Erreur: {error}</p>
    );
  }

  const activeFilters = [];
  if (categoryParam)
    activeFilters.push({
      name: `Catégorie: ${categoryParam}`,
      type: "category",
    });
  if (cityParam)
    activeFilters.push({ name: `Ville: ${cityParam}`, type: "city" });
  if (regionParam)
    activeFilters.push({ name: `Région: ${regionParam}`, type: "region" });
  if (producerParam)
    activeFilters.push({
      name: `Producteur: ${producerParam}`,
      type: "producer",
    });
  if (minPriceParam || maxPriceParam)
    activeFilters.push({
      name: `Prix: ${minPrice} - ${maxPrice} GNF`,
      type: "price",
    });

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ✅ Rendu de la notification en se basant sur l'état 'alert' du contexte */}
      <Notification
        type="success"
        message={alert.type === "success" ? alert.message : null}
        onClose={() => setAlert({ type: null, message: null })}
      />

      {/* ✅ Rendu du modal en se basant sur l'état 'alert' du contexte */}
      <ModalAlert
        message={alert.type === "error" ? alert.message : null}
        onClose={() => setAlert({ type: null, message: null })}
      />

      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Tous les produits</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 ${
              showFilters ? "bg-gray-200" : ""
            }`}
          >
            <Filter size={20} />
            <span>
              {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
            </span>
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid" ? "bg-green-100 text-green-600" : "bg-white"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list" ? "bg-green-100 text-green-600" : "bg-white"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>
      {showFilters && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
          <h3 className="text-xl font-semibold mb-4">Filtrer par</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="font-semibold mb-2">Catégorie</p>
              <select
                onChange={(e) => handleFilterChange(e, "category")}
                value={categoryParam || "all"}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="all">Toutes les catégories</option>
                {PREDEFINED_FILTERS.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="font-semibold mb-2">Ville</p>
              <select
                onChange={(e) => handleFilterChange(e, "city")}
                value={cityParam || "all"}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="all">Toutes les villes</option>
                {PREDEFINED_FILTERS.villes.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="font-semibold mb-2">Région</p>
              <select
                onChange={(e) => handleFilterChange(e, "region")}
                value={regionParam || "all"}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="all">Toutes les régions</option>
                {PREDEFINED_FILTERS.regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="font-semibold mb-2">Producteur</p>
              <select
                onChange={(e) => handleFilterChange(e, "producer")}
                value={producerParam || "all"}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="all">Tous les producteurs</option>
                {PREDEFINED_FILTERS.producteurs.map((producer) => (
                  <option key={producer} value={producer}>
                    {producer}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <p className="font-semibold mb-2">Fourchette de prix</p>
              <div className="flex items-center space-x-4">
                <div>
                  <label htmlFor="min-price" className="sr-only">
                    Prix min
                  </label>
                  <input
                    type="number"
                    id="min-price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    onBlur={handlePriceChange}
                    className="w-24 border border-gray-300 rounded-lg p-2 text-sm"
                    placeholder="Min"
                  />
                </div>
                <span>-</span>
                <div>
                  <label htmlFor="max-price" className="sr-only">
                    Prix max
                  </label>
                  <input
                    type="number"
                    id="max-price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    onBlur={handlePriceChange}
                    className="w-24 border border-gray-300 rounded-lg p-2 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeFilters.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mb-6">
          <span className="text-gray-600 font-semibold mr-2">
            Filtres actifs :
          </span>
          {activeFilters.map((filter) => (
            <span
              key={filter.name}
              className="flex items-center space-x-1 bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full"
            >
              <span>{filter.name}</span>
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-red-600 hover:underline text-sm font-medium"
          >
            <XCircle size={16} />
            <span>Réinitialiser</span>
          </button>
        </div>
      )}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Aucun produit trouvé.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <Link to={`/produit/${product._id}`} className="block h-full">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-lg mt-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description || "Description non disponible."}
                  </p>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.rating || 0})
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-green-600 text-lg">
                    {product.price.toLocaleString()} GNF
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <Link to={`/produit/${product._id}`} className="block">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full md:w-32 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
                  />
                </Link>
                <div className="flex-grow">
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-lg mt-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description || "Description non disponible."}
                  </p>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.rating || 0})
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end mt-4 md:mt-0">
                  <span className="font-bold text-green-600 text-xl">
                    {product.price.toLocaleString()} GNF
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm mt-2 hover:bg-green-700 transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;