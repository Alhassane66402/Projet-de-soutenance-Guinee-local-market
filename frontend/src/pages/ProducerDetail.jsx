// src/pages/ProducerDetail.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Mail, Phone, MapPin, CalendarDays, ShoppingCart } from "lucide-react";
import { fetchProducerById, fetchProductsByProducer } from "../services/producerService";
import { BASE_URL } from "../utils/axios";
import { useApp } from "../hooks/useApp";
import Notification from "../components/Notification";
import ModalAlert from "../components/ModalAlert";

/**
 * Composant d'affichage des détails d'un producteur et de ses produits.
 */
const ProducerDetail = () => {
  // ------------------------------
  // 1. GESTION DES ÉTATS ET CONTEXTE
  // ------------------------------
  const { id } = useParams();
  const [producer, setProducer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Utilisation du hook useApp pour accéder à la logique du panier et aux alertes
  const { addToCart, alert, setAlert } = useApp();

  // ------------------------------
  // 2. EFFETS SECONDAIRES (FETCHING DES DONNÉES)
  // ------------------------------
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [producerData, productsData] = await Promise.all([
          fetchProducerById(id),
          fetchProductsByProducer(id),
        ]);

        setProducer(producerData || null);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Erreur de chargement des détails du producteur:", err);
        setError(err.message || "Une erreur est survenue lors du chargement.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ------------------------------
  // 3. FONCTIONS UTILITAIRES ET HANDLERS
  // ------------------------------
  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `${BASE_URL}${path}`;

  /**
   * Gère l'ajout d'un produit au panier.
   * La vérification du producteur est maintenant dans le hook useApp.
   * @param {object} product - Le produit à ajouter au panier.
   */
  const handleAddToCart = (product) => {
    // La validation est maintenant gérée par le hook useApp.
    // Il suffit d'appeler la fonction et le hook gérera les messages.
    addToCart(product, 1);
  };

  // ------------------------------
  // 4. RENDU CONDITIONNEL (LOADING, ERREUR, INTROUVABLE)
  // ------------------------------
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

  if (!producer) {
    return (
      <p className="text-center text-gray-500 text-lg mt-10">
        Producteur introuvable.
      </p>
    );
  }

  // ------------------------------
  // 5. RENDU PRINCIPAL DU COMPOSANT
  // ------------------------------
  return (
    <div className="container mx-auto px-4 py-8">
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

      <Link
        to="/producteurs"
        className="text-green-600 p-2 rounded-lg font-medium mb-6 inline-block hover:bg-green-100"
      >
        ← Retour aux producteurs
      </Link>

      {/* Section d'en-tête du producteur */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
        <div className="h-64 bg-gray-200 md:h-80">
          {producer.cover && (
            <img
              src={getImageUrl(producer.cover)}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {/* Détails du profil et avatar */}
        <div className="p-6 md:p-8 relative -mt-16">
          <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-8">
            <div className="w-40 h-40 rounded-full border-3 border-white shadow-md overflow-hidden bg-gray-300">
              {producer.avatar && (
                <img
                  src={getImageUrl(producer.avatar)}
                  alt="Avatar"
                  className="w-full h-full"
                />
              )}
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-1 text-green-600 leading-tight">
                {producer.groupName || producer.name}
              </h1>
              <h3 className="text-xl font-semibold text-gray-700 leading-tight">{producer.name}</h3>
              <p className="text-gray-600 text-lg">
                <MapPin className="inline-block w-4 h-4 mr-1 text-green-500" />
                {producer.adresse}, {producer.ville}, {producer.region}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-1 rounded-full text-white font-semibold text-sm ${producer.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}>
                {producer.isBlocked ? "Bloqué" : "Actif"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections d'information et "À propos" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <Mail className="w-6 h-6 mr-2 text-green-500" />
            Coordonnées
          </h2>
          <div className="space-y-3 text-gray-700">
            <p className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-gray-500" />
              <strong>Email:</strong> {producer.email}
            </p>
            <p className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-gray-500" />
              <strong>Téléphone:</strong> {producer.telephone}
            </p>
            <p className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" />
              <strong>Adresse:</strong> {producer.adresse}
            </p>
            <p className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
              <strong>Membre depuis:</strong>{" "}
              {new Date(producer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            À propos
          </h2>
          <p className="text-gray-600">
            {producer.bio}
          </p>
        </div>
      </div>

      {/* Section des produits */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Produits de {producer.name}
        </h2>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            Ce producteur n'a pas encore de produits à afficher.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
              >
                <Link to={`/produits/${product._id}`} className="block h-full">
                  <div className="h-48 w-full">
                    {product.image && (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="text-xl font-bold text-green-700 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{product.price} GNF</p>
                    <p className="text-gray-500 text-sm">
                      {product.category}
                    </p>
                  </div>
                </Link>
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProducerDetail;