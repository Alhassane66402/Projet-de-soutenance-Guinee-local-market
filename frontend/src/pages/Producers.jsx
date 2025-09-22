import React, { useEffect, useState } from "react";
import { fetchValidatedProducers } from "../services/producerService";
import { Link } from "react-router-dom";
import { Banknote, Briefcase, Building, Loader2, User, Users } from "lucide-react";
import { BASE_URL } from "../utils/axios";

const Producers = () => {
  const [producers, setProducers] = useState([]);
  const [filteredProducers, setFilteredProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `${BASE_URL}${path}`;

  useEffect(() => {
    const loadProducers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchValidatedProducers();
        if (Array.isArray(data)) {
          setProducers(data);
          setFilteredProducers(data);
        } else {
          throw new Error("Les données de l'API ne sont pas au format attendu (tableau).");
        }
      } catch (err) {
        console.error("Erreur de chargement des producteurs:", err);
        setError(err.message || "Une erreur est survenue lors du chargement des producteurs.");
      } finally {
        setLoading(false);
      }
    };
    loadProducers();
  }, []);

  useEffect(() => {
    const filtered = producers.filter((p) => {
      const searchTerm = search.toLowerCase();
      return (
        p.name?.toLowerCase().includes(searchTerm) ||
        p.ville?.toLowerCase().includes(searchTerm) ||
        p.region?.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredProducers(filtered);
  }, [search, producers]);

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-green-700">
        Nos Producteurs Passionnés 🌱
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Découvrez les visages derrière nos produits. Chaque producteur a été vérifié pour garantir la qualité et l'authenticité de leurs produits.
      </p>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Rechercher un producteur par nom, ville, ou région..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-sm text-gray-700"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-green-500" size={64} />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : filteredProducers.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Aucun producteur ne correspond à votre recherche.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducers.map((producer) => (
            <div
              key={producer._id}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-100 group overflow-hidden"
            >
              <div className="relative h-32 w-full bg-green-100 overflow-hidden">
                {producer.cover ? (
                  <img
                    src={getImageUrl(producer.cover)}
                    alt={`Cover de ${producer.name}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-green-200 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-100"></div>
                  </div>
                )}
              </div>

              <div className="p-4 pt-10 flex flex-col justify-between  text-center h-[calc(100%-8rem)]">
                <div className="flex-grow flex flex-col items-center">
                  <h2 className="text-2xl font-bold mb-1 text-green-600">
                    {producer.name}
                  </h2>
                  {producer.groupName && (
                    <p className="text-lg font-semibold text-black mb-2 flex items-center gap-2">
                      <Building size={20} className="text-gray-500" />
                      {producer.groupName}
                    </p>
                    
                  )}
                  {/* Status du producteur */}
                  <p className="text-lg font-semibold text-black mb-2 flex items-center gap-2">
                      {producer.isBlocked}
                    </p>
                  {(producer.ville || producer.region) && (
                    <p className="text-gray-600 flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {producer.ville && producer.region
                        ? `${producer.ville}, ${producer.region}`
                        : producer.ville || producer.region}
                    </p>
                  )}
                </div>

                <Link
                  to={`/producteurs/${producer._id}`}
                  className="mt-2 block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Voir le profil
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Producers;