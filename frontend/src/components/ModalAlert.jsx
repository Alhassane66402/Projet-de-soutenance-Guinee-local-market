// src/components/Modal.jsx
import React, { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function ModalAlert({ message, onClose }) {
  if (!message) return null;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // ✅ Empêche l'action par défaut de la touche Entrée
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4 transform transition-transform duration-300 scale-100 animate-fade-in-up">
        <div className="flex flex-col items-center text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2 text-red-700">Erreur de Panier</h2>
          <p className="text-gray-700 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}