import React, { useEffect, useState } from "react";
import { fetchValidatedProducers } from "../services/producerService";
import { Link } from "react-router-dom";

const Producers = () => {
  const [producers, setProducers] = useState([]);
  const [filteredProducers, setFilteredProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Ajout d'un état pour gérer les erreurs
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProducers = async () => {
      setLoading(true);
      setError(null); // Réinitialiser l'erreur avant chaque chargement
      try {
        const data = await fetchValidatedProducers();
        // Vérifier que les données sont bien un tableau avant de les utiliser
        if (Array.isArray(data)) {
          setProducers(data);
          setFilteredProducers(data);
        } else {
          // Si les données ne sont pas un tableau, afficher une erreur
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

  // Filtrer les producteurs selon la recherche
  useEffect(() => {
    const filtered = producers.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ville?.toLowerCase().includes(search.toLowerCase()) ||
      p.region?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducers(filtered);
  }, [search, producers]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Nos producteurs</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom, ville ou région..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredProducers.length === 0 ? (
        <p className="text-center text-gray-500">Aucun producteur trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducers.map((producer) => (
            <div
              key={producer._id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-1">{producer.name}</h2>
                {producer.ville && producer.region && (
                  <p className="text-gray-600 mb-1">
                    {producer.ville}, {producer.region}
                  </p>
                )}
                {producer.bio && <p className="text-gray-700 mb-2">{producer.bio}</p>}
                <p className="text-green-600 font-medium">Vérifié ✅</p>
              </div>

              <Link
                to={`/producteurs/${producer._id}`}
                className="mt-4 block text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Voir le profil
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Producers;
