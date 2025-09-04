import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck, Clock } from "lucide-react";

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Mangue fraîche de Guinée",
      price: 1500,
      image: "https://via.placeholder.com/300x300?text=Mangue",
      rating: 4.8
    },
    {
      id: 2,
      name: "Café de Fouta Djallon",
      price: 8000,
      image: "https://via.placeholder.com/300x300?text=Café",
      rating: 4.7
    },
    {
      id: 3,
      name: "Pagne traditionnel",
      price: 35000,
      image: "https://via.placeholder.com/300x300?text=Pagne",
      rating: 4.9
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Découvrez les trésors de la Guinée
              </h1>
              <p className="text-xl mb-8">
                Des produits locaux authentiques, directement des producteurs guinéens jusqu'à votre porte.
              </p>
              <Link
                to="/produits"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold inline-flex items-center hover:bg-gray-100 transition-colors"
              >
                Explorer les produits <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://via.placeholder.com/500x400?text=Produits+Guinée"
                alt="Produits guinéens"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Guinée Local Market ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Produits Authentiques</h3>
              <p className="text-gray-600">Des produits 100% guinéens, directement des producteurs locaux.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">Livraison dans tout le pays avec des délais optimisés.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Client</h3>
              <p className="text-gray-600">Notre équipe est disponible 7j/7 pour vous accompagner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Produits populaires</h2>
            <Link to="/produits" className="text-green-600 font-semibold hover:underline">
              Voir tous les produits
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span className="font-bold text-green-600">{product.price.toLocaleString()} GNF</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                  </div>
                  <Link
                    to={`/produit/${product.id}`}
                    className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Voir le produit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;