// src/pages/Profile.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../hooks/useApp"; // Importez le hook personnalisé

export default function Profile() {
  // Récupérer les données de l'utilisateur depuis le contexte
  const { isLoggedIn, setIsLoggedIn } = useApp();

  // Fonction de déconnexion (simple pour l'exemple)
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Dans une vraie application, vous feriez une requête API pour déconnecter l'utilisateur
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>
      
      {isLoggedIn ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg mb-4">
            Bienvenue sur votre espace personnel.
          </p>
          <p className="text-gray-600 mb-6">
            Vous êtes connecté et pouvez gérer vos informations et vos commandes ici.
          </p>
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-lg mb-4">
            Vous n'êtes pas connecté.
          </p>
          <p className="text-gray-600 mb-6">
            Pour accéder à votre profil, veuillez vous connecter ou vous inscrire.
          </p>
          <Link
            to="/connexion"
            className="w-full inline-block bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      )}
    </div>
  );
}