// src/pages/admin/AdminUsers.jsx
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
import { fetchAllUsers, toggleBlockUser } from "../../services/adminService";
import ModalUsers from "../../components/admin/ModalUsers";
import Notification from "../../components/Notification";

const initialState = {
  users: [],
  loading: true,
  error: null,
  confirmation: null,
  selectedUser: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null, confirmation: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "CLEAR_CONFIRMATION":
      return { ...state, confirmation: null, error: null };
    case "OPEN_MODAL":
      return { ...state, selectedUser: action.payload };
    case "CLOSE_MODAL":
      return { ...state, selectedUser: null };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        ),
        confirmation: action.message || null,
      };
    default:
      throw new Error("Action non supportée.");
  }
}

export default function AdminUsers() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [notificationType, setNotificationType] = useState("success");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    producer: "bg-green-100 text-green-800",
    consumer: "bg-blue-100 text-blue-800",
  };

  useEffect(() => {
    const loadUsers = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const data = await fetchAllUsers();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Échec du chargement des utilisateurs. Veuillez réessayer.",
        });
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (state.confirmation || state.error) {
      const timer = setTimeout(
        () => dispatch({ type: "CLEAR_CONFIRMATION" }),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [state.confirmation, state.error]);

  const handleDetails = (user) => {
    dispatch({ type: "OPEN_MODAL", payload: user });
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await toggleBlockUser(userId);
      const isBlocking = res.user.isBlocked;
      setNotificationType(isBlocking ? "error" : "success");
      dispatch({
        type: "UPDATE_USER",
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

  const handleUsersPerPageChange = (e) => {
    const newPerPage = Number(e.target.value);
    setUsersPerPage(newPerPage);
    setCurrentPage(1);
  };

  if (state.loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Chargement des utilisateurs...</p>
      </div>
    );
  }

  // Obtenir les villes uniques pour le filtre
  const uniqueCities = [
    "all",
    ...new Set(state.users.map((user) => user.ville)),
  ].filter(Boolean);

  // Filtrer les utilisateurs
  const filteredUsers = state.users.filter((user) => {
    const matchesSearch = Object.values(user).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesCity = cityFilter === "all" || user.ville === cityFilter;
    const matchesStatus =
      statusFilter === "all" || user.isValidated.toString() === statusFilter;

    return matchesSearch && matchesRole && matchesCity && matchesStatus;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="mt-18 md:mt-20 lg:mt-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Gestion des utilisateurs</h1>

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
        {/* Filtre de pagination et autres filtres */}
        <div className="flex flex-wrap gap-4 items-end">
          {/* Nombre d'utilisateurs par page */}
          <div className="flex flex-col">
            <label htmlFor="usersPerPage" className="text-gray-700 font-medium mb-1">
              Utilisateurs par page :
            </label>
            <select
              id="usersPerPage"
              value={usersPerPage}
              onChange={handleUsersPerPageChange}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          {/* Les autres filtres */}
          <div className="flex flex-wrap gap-4">
            {/* Filtre par rôle */}
            <div className="flex flex-col">
              <label htmlFor="roleFilter" className="text-gray-700 font-medium mb-1">
                Rôle :
              </label>
              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-md"
              >
                <option value="all">Tous</option>
                <option value="admin">Admin</option>
                <option value="producer">Producteur</option>
                <option value="consumer">Consommateur</option>
              </select>
            </div>

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N°
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom et prénom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
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
            {currentUsers.map((u, index) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {indexOfFirstUser + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {u.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {u.email}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {u.telephone}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      roleColors[u.role] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {u.ville}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {u.isValidated ? (
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
                    onClick={() => handleDetails(u)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    title={`Voir les détails de ${u.name}`}
                  >
                    <Info size={16} />
                  </button>

                  <button
                    onClick={() => handleToggleBlock(u._id)}
                    className={`
                      flex items-center gap-1 px-3 py-1 rounded
                      transition-colors duration-200
                      ${
                        u.isBlocked
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }
                    `}
                    title={
                      u.isBlocked
                        ? "Débloquer le producteur"
                        : "Bloquer le producteur"
                    }
                  >
                    {u.isBlocked ? (
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

      <ModalUsers
        user={state.selectedUser}
        onClose={() => dispatch({ type: "CLOSE_MODAL" })}
      />
    </div>
  );
}