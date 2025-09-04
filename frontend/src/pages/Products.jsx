import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, Grid, List, Star } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const category = searchParams.get("category");
  
  const products = [
    { id: 1, name: "Mangue fraîche", category: "Fruits & Légumes", price: 1500, rating: 4.8, image: "https://via.placeholder.com/300x300?text=Mangue" },
    { id: 2, name: "Panier en bambou", category: "Artisanat Local", price: 25000, rating: 4.5, image: "https://via.placeholder.com/300x300?text=Panier" },
    { id: 3, name: "Poivre de Guinée", category: "Épices & Condiments", price: 5000, rating: 4.7, image: "https://via.placeholder.com/300x300?text=Poivre" },
    { id: 4, name: "Pagne traditionnel", category: "Textiles Traditionnels", price: 35000, rating: 4.9, image: "https://via.placeholder.com/300x300?text=Pagne" },
    { id: 5, name: "Café de Fouta Djallon", category: "Café & Thé", price: 8000, rating: 4.8, image: "https://via.placeholder.com/300x300?text=Café" },
    { id: 6, name: "Miel bio", category: "Produits Bio", price: 12000, rating: 4.6, image: "https://via.placeholder.com/300x300?text=Miel" },
    { id: 7, name: "Ananas", category: "Fruits & Légumes", price: 3000, rating: 4.4, image: "https://via.placeholder.com/300x300?text=Ananas" },
    { id: 8, name: "Sculpture en bois", category: "Artisanat Local", price: 45000, rating: 4.9, image: "https://via.placeholder.com/300x300?text=Sculpture" },
  ];

  const categories = [
    "Tous les produits",
    "Fruits & Légumes",
    "Artisanat Local",
    "Épices & Condiments",
    "Textiles Traditionnels",
    "Café & Thé",
    "Produits Bio"
  ];

  const filteredProducts = category 
    ? products.filter(product => product.category === category)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          {category ? `Produits - ${category}` : "Tous les produits"}
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2">
            <Filter size={18} className="text-gray-600 mr-2" />
            <select 
              className="bg-transparent outline-none"
              value={category || "all"}
              onChange={(e) => {
                if (e.target.value === "all") {
                  setSearchParams({});
                } else {
                  setSearchParams({ category: e.target.value });
                }
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat === "Tous les produits" ? "all" : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-green-100 text-green-600" : "bg-white"}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-green-100 text-green-600" : "bg-white"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="font-semibold text-lg mt-2 mb-1">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-green-600">{product.price.toLocaleString()} GNF</span>
                  <Link
                    to={`/produit/${product.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <img src={product.image} alt={product.name} className="w-full md:w-32 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-6" />
                <div className="flex-grow">
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-lg mt-2 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                  </div>
                </div>
                <div className="flex flex-col items-end mt-4 md:mt-0">
                  <span className="font-bold text-green-600 text-xl">{product.price.toLocaleString()} GNF</span>
                  <Link
                    to={`/produit/${product.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm mt-2 hover:bg-green-700 transition-colors"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Aucun produit trouvé dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
};

export default Products;