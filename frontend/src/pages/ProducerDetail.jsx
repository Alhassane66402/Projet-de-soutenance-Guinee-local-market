import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducerById } from "../services/producerService";

const ProducerDetail = () => {
  const { id } = useParams();
  const [producer, setProducer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducer = async () => {
      try {
        const data = await fetchProducerById(id);
        setProducer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducer();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!producer) return <p>Producteur introuvable</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/producteurs" className="text-green-600 font-medium mb-6 inline-block">
        ← Retour aux producteurs
      </Link>

      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">{producer.name}</h1>
      <p className="text-gray-600 mb-1">{producer.ville}, {producer.region}</p>
      {producer.bio && <p className="mb-2">{producer.bio}</p>}
      <p className="text-green-600 font-medium">Vérifié ✅</p>

      {/* Contact Info */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p><strong>Email:</strong> {producer.email}</p>
        <p><strong>Téléphone:</strong> {producer.telephone}</p>
        <p><strong>Adresse:</strong> {producer.adresse}</p>
      </div>

      {/* Infos supplémentaires */}
      <div className="mt-6">
        <p>Membre depuis : {new Date(producer.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ProducerDetail;
