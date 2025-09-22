// src/pages/Home.jsx
"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Truck,
  Shield,
  Users,
  ArrowRight,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchValidatedProducts } from "../services/productService";
import { fetchValidatedProducers } from "../services/producerService";
import { BASE_URL } from "../utils/axios";

// ==========================================================================
// 🌿 Données statiques
// (Conserver les données de démo en dehors du composant pour éviter les recréations inutiles)
// ==========================================================================
const bannerSlides = [
  {
    id: 1,
    title: "Découvrez les Saveurs Authentiques de Guinée",
    subtitle: "Produits frais directement des producteurs locaux",
    image: "/african-market-with-fresh-fruits-and-vegetables.png",
    cta: "Explorer Maintenant",
    link: "/produits",
  },
  {
    id: 2,
    title: "Soutenez l'Agriculture Locale",
    subtitle: "Chaque achat aide nos communautés à prospérer",
    image: "/guinea-farmers-working-in-fields-with-traditional-.png",
    cta: "Voir les Producteurs",
    link: "/producteurs",
  },
  {
    id: 3,
    title: "Livraison Rapide",
    subtitle: "Recevez vos produits partout en Guinée",
    image: "/delivery-truck-in-african-city-street.png",
    cta: "Commander",
    link: "/produits",
  },
];

const features = [
  {
    icon: MapPin,
    title: "Producteurs Locaux",
    description: "Trouvez les producteurs près de chez vous",
  },
  {
    icon: Truck,
    title: "Livraison Rapide",
    description: "Livraison rapide partout en Guinée",
  },
  {
    icon: Shield,
    title: "Qualité Garantie",
    description: "Produits frais et de qualité",
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Soutenez l'économie locale",
  },
];

const dummyCategories = [
  {
    name: "Fruits",
    image: "/images/category-fruits.jpg",
    description:
      "Découvrez des fruits frais et savoureux comme les mangues, avocats, bananes et ananas, directement de nos vergers.",
  },
  {
    name: "Légumes",
    image: "/images/category-vegetables.jpg",
    description:
      "Des légumes de saison et des herbes aromatiques pour des plats sains et pleins de saveur.",
  },
  {
    name: "Tubercules",
    image: "/images/category-tubers.jpg",
    description:
      "Retrouvez nos tubercules essentiels à la cuisine locale : manioc, igname, patate douce et taro.",
  },
  {
    name: "Céréales",
    image: "/images/category-cereals.jpg",
    description:
      "Le fonio, le riz local et le maïs sont la base de notre alimentation. Soutenez la culture locale.",
  },
  {
    name: "Légumineuses",
    image: "/images/category-legumes.jpg",
    description:
      "Haricots, lentilles et pois : des sources de protéines saines et cultivées localement.",
  },
  {
    name: "Produits de la mer",
    image: "/images/category-seafood.jpg",
    description:
      "Découvrez des poissons et fruits de mer fraîchement pêchés sur nos côtes atlantiques.",
  },
  {
    name: "Viandes & Volaille",
    image: "/images/category-meat-poultry.jpg",
    description:
      "Viandes de bœuf, poulet fermier et mouton, issus d'élevages responsables.",
  },
  {
    name: "Produits Laitiers",
    image: "/images/category-dairy.jpg",
    description:
      "Lait, fromages et autres produits laitiers artisanaux de nos producteurs locaux.",
  },
  {
    name: "Épices & Condiments",
    image: "/images/category-spices.jpg",
    description:
      "Sublimez vos plats avec nos épices traditionnelles : gingembre, piment, poivre et autres saveurs uniques.",
  },
  {
    name: "Boissons & Jus Naturels",
    image: "/images/category-beverages.jpg",
    description:
      "Rafraîchissez-vous avec nos jus de fruits locaux, bissap, gingembre et autres boissons saines.",
  },
];

// ==========================================================================
// 🧱 Composants réutilisables
// ==========================================================================
const Button = ({ children, variant, size, className, ...props }) => {
  let baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  if (variant === "ghost") {
    baseStyles +=
      " bg-transparent hover:bg-accent hover:text-accent-foreground";
  } else {
    baseStyles +=
      " bg-primary text-primary-foreground shadow hover:bg-primary/90";
  }
  if (size === "lg") {
    baseStyles += " h-10 px-8 py-2";
  } else {
    baseStyles += " h-9 px-4 py-2";
  }
  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ==========================================================================
// 🏡 Composant principal Home
// ==========================================================================
export default function Home() {
  const [producers, setProducers] = useState([]);
  const [producerLoading, setProducerLoading] = useState(true);
  const [producerError, setProducerError] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `${BASE_URL}${path}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchValidatedProducts();
        if (response && Array.isArray(response.data)) {
          setProducts(response.data.slice(0, 3));
        } else {
          setProducts([]);
          setError("Le format des données de l'API est incorrect.");
        }
      } catch (err) {
        console.error("Échec de la récupération des produits :", err);
        setError(
          "Impossible de charger les produits. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const loadProducers = async () => {
      setProducerLoading(true);
      setProducerError(null);
      try {
        const response = await fetchValidatedProducers();
        if (response && Array.isArray(response)) {
          setProducers(response.slice(0, 3));
        } else {
          setProducers([]);
          setProducerError(
            "Le format des données des producteurs est incorrect."
          );
        }
      } catch (err) {
        console.error("Échec de la récupération des producteurs :", err);
        setProducerError(
          "Impossible de charger les producteurs. Veuillez réessayer plus tard."
        );
      } finally {
        setProducerLoading(false);
      }
    };
    loadProducers();
  }, []);

  // ==========================================================================
  // 🎨 Rendu visuel
  // ==========================================================================
  return (
    <div>
      {/* Bannière principale (Hero) */}
      <section className="relative my-4 md:my-8">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg mx-4 md:mx-8">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-2xl px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-pretty">
                      {slide.subtitle}
                    </p>
                    <Link to={slide.link}>
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-green-200 hover:text-green-600"
                      >
                        {slide.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
        {/* Grille de fonctionnalités */}
        <div className="container mx-auto px-4 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catégories de produits */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-green-600 text-center mb-8">
          Parcourez nos catégories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyCategories.map((category) => (
            <Link
              key={category.name}
              to={`/produits?category=${encodeURIComponent(category.name)}`}
              className="block rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="text-xl font-bold text-gray-800">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Produits en vedette */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="justify-center text-center items-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Nos produits phares
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les meilleurs produits de nos producteurs locaux
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-green-500" size={48} />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg mt-10">
            Erreur: {error}
          </p>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Aucun produit phare disponible pour le moment.
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
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
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-green-600 text-lg">
                        {product.price.toLocaleString()} GNF
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          console.log("Ajout au panier non implémenté ici.");
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
            {/* Nouveau : Lien en bas des cartes de produits */}
            <div className="mt-8 text-center">
              <Link
                to="/produits"
                className="inline-flex items-center text-green-600 font-semibold hover:underline"
              >
                Voir tous les produits <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Section des producteurs en vedette (dynamique) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="justify-center text-center items-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Nos producteurs en vedette
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos producteurs les plus populaires et leurs produits
            frais.
          </p>
        </div>
        {producerLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-green-500" size={48} />
          </div>
        ) : producerError ? (
          <p className="text-center text-red-500 text-lg mt-10">
            Erreur: {producerError}
          </p>
        ) : producers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Aucun producteur en vedette n'est disponible pour le moment.
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {producers.map((producer) => (
                <div
                  key={producer._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Conteneur principal pour le contenu (couverture + détails) */}
                  <div className="flex flex-col flex-grow">
                    {/* 1. Espace photo de couverture */}
                    <div className="relative h-40">
                      <img
                        src={getImageUrl(producer.cover)}
                        alt={`Couverture de ${producer.groupName}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                    </div>

                    {/* 2. Bloc pour l'avatar et les infos alignés */}
                    <div className=" p-2 flex items-center">
                      <img
                        src={getImageUrl(producer.avatar)}
                        alt={`Avatar de ${producer.groupName}`}
                        className="w-30 h-30 rounded-full border-4 border-white shadow-lg"
                      />

                      {/* 3. Contenu de la carte - informations sur le producteur */}
                      <div className="ml-4 flex-grow text-start">
                        <h3 className="font-bold text-green-600 text-2xl mb-1">
                          {producer.groupName || producer.name}
                        </h3>
                        <p className="text-md font-semibold text-gray-700 mb-1 line-clamp-2">
                          {producer.name}
                        </p>
                        <div className="flex items-center text-sm text-gray-600 my-2">
                          <MapPin className="mr-2" size={16} />{" "}
                          {producer.adresse}, {producer.ville},{" "}
                          {producer.region}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Catégories et Bouton (toujours en bas) */}
                  <div className="p-4 pt-0 text-center">
                    {producer.categories && producer.categories.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {producer.categories.map((category, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link to={`/producteurs/${producer._id}`}>
                      <Button className="w-full bg-green-200 hover:bg-green-600">
                        Voir le profil
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {/* Lien en bas des cartes de producteurs */}
            <div className="mt-8 text-center">
              <Link
                to="/producteurs"
                className="inline-flex items-center text-green-600 font-semibold hover:underline"
              >
                Voir tous les producteurs{" "}
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Section 'À propos' mise à jour */}
      <section className="bg-gray-100 rounded-lg p-8 md:p-12 my-12 text-center shadow-inner max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          Notre histoire, notre engagement
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Nous connectons les consommateurs aux agriculteurs locaux de Guinée,
          assurant des produits frais, de qualité et un commerce équitable.
          Chaque achat soutient directement nos communautés agricoles.
        </p>
        <Link
          to="/a-propos"
          className="mt-6 inline-flex items-center text-green-600 font-semibold hover:underline"
        >
          En savoir plus sur notre mission{" "}
          <ArrowRight className="ml-2" size={20} />
        </Link>
      </section>
    </div>
  );
}
