// src/components/Modal.jsx
import { X, User, Mail, Phone, MapPin, Info, Tag, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = "http://localhost:3000";

export default function Modal({ user, onClose }) {
  if (!user) return null;

  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `${BASE_URL}${path}`;
  const avatarUrl = getImageUrl(user.avatar || "/default-avatar.png");
  const coverUrl = user.cover ? getImageUrl(user.cover) : null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50  z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
        >
          {/* Header avec titre et bouton fermer */}
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">
              Détails d'un utilisateur
            </h1>
            {/* Bouton de fermeture */}
            <button
              onClick={onClose}
              className="absolute top-2 right-4 text-white hover:text-gray-200 bg-black/30 rounded-full p-2 transition-colors duration-200 z-10"
              aria-label="Fermer le modal"
            >
              <X size={20} />
            </button>
          </div>
          {/* Header qui s'adapte en fonction de la présence d'une couverture */}
          <div className="relative">
            {coverUrl ? (
              <>
                <img
                  src={coverUrl}
                  alt="Cover"
                  className="w-full h-50 md:h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </>
            ) : (
              // En-tête de secours si pas de cover
              <div className="w-full h-24 md:h-32 bg-gray-200"></div>
            )}

            <div
              className={`absolute bottom-0 left-0 p-6 flex items-end w-full ${
                coverUrl ? "text-white drop-shadow-lg" : "text-gray-900"
              }`}
            >
              <img
                src={avatarUrl}
                alt="Avatar"
                className={`w-35 h-35 rounded-full border-4 ${
                  coverUrl ? "border-white" : "border-gray-200"
                } shadow-lg -mb-12`}
              />
              <h2 className="ml-4 text-3xl font-bold">{user.name}</h2>
            </div>
          </div>

          <div className="p-6 pt-10 space-y-6">
            {/* Section Informations de base */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info size={20} /> Informations de base
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="flex items-center gap-2 col-span-2">
                  <Phone size={16} className="text-gray-500" />
                  <strong>Téléphone:</strong> {user.telephone || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <strong>Adresse:</strong> {user.adresse}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <strong>Ville:</strong> {user.ville}, {user.region}
                </p>
                <p>
                  <strong>Rôle:</strong>{" "}
                  <span className="capitalize px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </p>
                <p>
                  <strong>Statut:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      user.isValidated ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user.isValidated ? "Validé" : "Non validé"}
                  </span>
                </p>
                {user.bio && (
                  <p className="col-span-1 sm:col-span-2">
                    <strong>Bio:</strong> {user.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Infos spécifiques aux producteurs ou administrateurs */}
            {(user.role === "producer" || user.role === "admin") && (
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users size={20} /> Informations supplémentaires
                </h3>
                <div className="space-y-2 text-gray-700">
                  {user.groupName && (
                    <p className="flex items-center gap-2">
                      <Tag size={16} className="text-gray-500" />
                      <strong>Nom du groupe:</strong> {user.groupName}
                    </p>
                  )}
                  {user.categories && user.categories.length > 0 && (
                    <p>
                      <strong>Catégories:</strong>{" "}
                      {user.categories.map((cat, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                        >
                          {cat}
                        </span>
                      ))}
                    </p>
                  )}
                  {!user.groupName &&
                    (!user.categories || user.categories.length === 0) && (
                      <p>Aucune information supplémentaire disponible.</p>
                    )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
