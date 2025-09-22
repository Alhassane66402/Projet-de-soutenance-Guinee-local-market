// src/pages/admin/AdminProducers.jsx
import { useEffect, useReducer, useState } from "react";
import {
  Mail,
  Phone,
  Info,
  XCircle,
  CheckCircle2,
  Lock,
  Unlock,
} from "lucide-react";
import {
  fetchAllProducers,
  toggleBlockUser,
} from "../../services/adminService";
import ModalProducers from "../../components/admin/ModalProducers";
import Notification from "../../components/Notification";

const initialState = {
  producers: [],
  loading: true,
  error: null,
  confirmation: null,
  selectedProducer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null, confirmation: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, producers: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "CLEAR_CONFIRMATION":
      return { ...state, confirmation: null, error: null };
    case "OPEN_MODAL":
      return { ...state, selectedProducer: action.payload };
    case "CLOSE_MODAL":
      return { ...state, selectedProducer: null };
    case "UPDATE_PRODUCER":
      return {
        ...state,
        producers: state.producers.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
        confirmation: action.message || null,
      };
    case "SET_MESSAGE":
      return {
        ...state,
        confirmation: action.payload,
      };
    default:
      throw new Error("Action non supportée.");
  }
}

export default function AdminProducers() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [notificationType, setNotificationType] = useState("success");
  const [currentPage, setCurrentPage] = useState(1);
  const [producersPerPage, setProducersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Charger les producteurs
  useEffect(() => {
    const loadProducers = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const data = await fetchAllProducers();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Échec du chargement des producteurs. Veuillez réessayer.",
        });
      }
    };
    loadProducers();
  }, []);

  // Supprimer les notifications après 3s
  useEffect(() => {
    if (state.confirmation || state.error) {
      const timer = setTimeout(
        () => dispatch({ type: "CLEAR_CONFIRMATION" }),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [state.confirmation, state.error]);

  const handleDetails = (producer) => {
    dispatch({ type: "OPEN_MODAL", payload: producer });
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await toggleBlockUser(userId);

      if (!res || !res.user)
        throw new Error("Producteur introuvable dans la réponse");

      const isBlocking = res.user.isBlocked;
      setNotificationType(isBlocking ? "error" : "success");

      dispatch({
        type: "UPDATE_PRODUCER",
        payload: res.user,
        message: res.message,
      });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.message || "Erreur inconnue",
      });
    }
  };

  // Mise à jour après validation / suppression depuis le modal
  const handleUpdateProducer = (updatedProducer, type = "success") => {
    if (type === "delete") {
      const updatedList = state.producers.filter(
        (p) => p._id !== updatedProducer._id
      );
      dispatch({
        type: "FETCH_SUCCESS",
        payload: updatedList,
      });
      setNotificationType("error");
      dispatch({
        type: "SET_MESSAGE",
        payload: "Producteur supprimé avec succès",
      });
    } else if (type === "success") {
      setNotificationType("success");
      dispatch({
        type: "UPDATE_PRODUCER",
        payload: updatedProducer,
        message: "Producteur validé avec succès",
      });
    } else if (type === "error") {
      setNotificationType("error");
      dispatch({
        type: "SET_MESSAGE",
        payload: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  // Gérer le changement du nombre de producteurs par page
  const handleProducersPerPageChange = (e) => {
    const newPerPage = Number(e.target.value);
    setProducersPerPage(newPerPage);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  if (state.loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Chargement des producteurs...</p>
      </div>
    );
  }

  // Obtenir les villes uniques pour le filtre
  const uniqueCities = [
    "",
    ...new Set(state.producers.map((producer) => producer.ville)),
  ].filter(Boolean);

  // Filtrer les producteurs en fonction de la recherche et des filtres
  const filteredProducers = state.producers.filter((producer) => {
    const matchesSearch = Object.values(producer).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesCity = cityFilter === "all" || producer.ville === cityFilter;
    const matchesStatus =
      statusFilter === "all" || producer.isValidated.toString() === statusFilter;

    return matchesSearch && matchesCity && matchesStatus;
  });

  // Calculer les indices et les données de pagination
  const indexOfLastProducer = currentPage * producersPerPage;
  const indexOfFirstProducer = indexOfLastProducer - producersPerPage;
  const currentProducers = filteredProducers.slice(
    indexOfFirstProducer,
    indexOfLastProducer
  );
  const totalPages = Math.ceil(filteredProducers.length / producersPerPage);

  return (
    <div className="mt-18 md:mt-20 lg:mt-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Gestion des producteurs</h1>

      {/* Notifications */}
      {state.confirmation && (
        <Notification
          message={state.confirmation}
          type={notificationType}
          onClose={() => dispatch({ type: "CLEAR_CONFIRMATION" })}
        />
      )}
      {state.error && (
        <Notification
          message={state.error}
          type="error"
          onClose={() => dispatch({ type: "CLEAR_CONFIRMATION" })}
        />
      )}

      {/* En-tête avec filtres et recherche */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
        {/* Conteneur pour les selects */}
        <div className="flex flex-wrap gap-4 items-start">
          {/* Nombre de producteurs par page */}
          <div className="flex flex-col">
            <label htmlFor="producersPerPage" className="text-gray-700 font-medium mb-1">
              Producteurs par page :
            </label>
            <select
              id="producersPerPage"
              value={producersPerPage}
              onChange={handleProducersPerPageChange}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Filtres de sélection */}
          <div className="flex flex-wrap gap-4">
            {/* Filtre par ville */}
            <div className="flex flex-col">
              <label htmlFor="cityFilter" className="text-gray-700 font-medium mb-1">
                Ville :
              </label>
              <select
                id="cityFilter"
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-md"
              >
                <option value="all">Toutes</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par statut */}
            <div className="flex flex-col">
              <label htmlFor="statusFilter" className="text-gray-700 font-medium mb-1">
                Statut :
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-md"
              >
                <option value="all">Tous</option>
                <option value="true">Validé</option>
                <option value="false">Non validé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Champ de recherche */}
        <div className="w-full md:w-1/3 flex flex-col items-start">
          <label htmlFor="search-field" className="text-gray-700 font-medium mb-1">
            Filtrer :
          </label>
          <input
            id="search-field"
            type="text"
            placeholder="Nom, prénom, ville, email, telephone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N°
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom et Prénom
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Groupement
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ville
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducers.map((p, index) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {indexOfFirstProducer + index + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {p.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {p.groupName}
                </td>
                <td className="flex flex-row gap-1 px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {p.email}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {p.telephone}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {p.ville}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  {p.isValidated ? (
                    <CheckCircle2
                      size={24}
                      className="text-green-600 mx-auto"
                      aria-label="Validé"
                    />
                  ) : (
                    <XCircle
                      size={24}
                      className="text-red-600 mx-auto"
                      aria-label="Non validé"
                    />
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleDetails(p)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    title={`Voir les détails de ${p.name}`}
                  >
                    <Info size={16} />
                  </button>

                  <button
                    onClick={() => handleToggleBlock(p._id)}
                    className={`
                      flex items-center gap-1 px-3 py-1 rounded 
                      transition-colors duration-200
                      ${
                        p.isBlocked
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }
                    `}
                    title={
                      p.isBlocked
                        ? "Débloquer le producteur"
                        : "Bloquer le producteur"
                    }
                  >
                    {p.isBlocked ? (
                      <>
                        <Unlock size={16} />
                        Débloquer
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Bloquer
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contrôles de pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`
              px-4 py-2 rounded-md
              ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }
            `}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>

      <ModalProducers
        producer={state.selectedProducer}
        onClose={() => dispatch({ type: "CLOSE_MODAL" })}
        onUpdate={handleUpdateProducer}
      />
    </div>
  );
}