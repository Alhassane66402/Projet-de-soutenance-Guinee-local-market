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
import { fetchAllProducers, toggleBlockUser } from "../../services/adminService";
import ModalProducers from "../../components/admin/ModalProducers";
import Notification from "../../components/admin/Notification";

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
    default:
      throw new Error("Action non supportée.");
  }
}

export default function AdminProducers() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [notificationType, setNotificationType] = useState("success");

  const roleColors = {
    premium: "bg-purple-100 text-purple-800",
    standard: "bg-green-100 text-green-800",
  };

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

  const handleToggleBlock = async (producerId) => {
    try {
      const res = await toggleBlockUser(producerId);

      // Notification type : bloqué = rouge, débloqué = vert
      const isBlocking = res.producer.isBlocked;
      setNotificationType(isBlocking ? "error" : "success");

      dispatch({
        type: "UPDATE_PRODUCER",
        payload: res.producer,
        message: res.message,
      });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.message || "Erreur inconnue",
      });
    }
  };

  if (state.loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Chargement des producteurs...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des producteurs</h1>

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

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ville
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.producers.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {p.name}
                </td>
                <td className="flex flex-row gap-1 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {p.email}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {p.telephone}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      roleColors[p.type] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {p.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {p.ville}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
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
                <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleDetails(p)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    title={`Voir les détails de ${p.name}`}
                  >
                    <Info size={16} />
                  </button>

                  <button
                    onClick={() => handleToggleBlock(p._id)}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                    title={
                      p.isBlocked
                        ? "Débloquer le producteur"
                        : "Bloquer le producteur"
                    }
                  >
                    {p.isBlocked ? (
                      <Lock
                        size={20}
                        className="text-red-600 hover:text-red-700"
                      />
                    ) : (
                      <Unlock
                        size={20}
                        className="text-green-600 hover:text-green-700"
                      />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalProducers
        producer={state.selectedProducer}
        onClose={() => dispatch({ type: "CLOSE_MODAL" })}
      />
    </div>
  );
}
