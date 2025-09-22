import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Heart,
  ShoppingBag,
} from "lucide-react";
import api from "../utils/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProfilePage() {
  // États principaux
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [recentOrders, setRecentOrders] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [message, setMessage] = useState(null);

  // ⚡ Récupération profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        const data = res.data;

        // ✨ Séparation prénom(s) + nom
        const nameParts = data.name ? data.name.trim().split(" ") : [];
        let firstName = "";
        let lastName = "";

        if (nameParts.length > 1) {
          lastName = nameParts.pop(); // dernier mot
          firstName = nameParts.join(" "); // tout le reste
        } else if (nameParts.length === 1) {
          firstName = nameParts[0]; // mot unique = prénom
        }

        setUserData({ ...data, joinedDate: data.createdAt });

        setFormData({
          firstName, // Tous les mots sauf le dernier
          lastName, // Dernier mot
          email: data.email || "",
          phone: data.telephone || "",
          adresse: data.adresse || "",
          ville: data.ville || "",
          region: data.region || "",
          avatar: data.avatar || "", // <-- récupère le nom ou le chemin de l'image
        });

        setRecentOrders(data.recentOrders || []);
        setFavoriteProducts(data.favoriteProducts || []);
      } catch (err) {
        console.error("Erreur récupération profil:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!userData) return <div>Chargement...</div>;

  // 🔹 Formatage prix et date
  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-GN", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // 🔹 Composant message
  const AlertMessage = ({ type, text }) => (
    <div
      className={`px-4 py-2 rounded mb-4 text-white ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      }`}
    >
      {text}
    </div>
  );

  // 🔹 Sauvegarde du profil
  const handleSaveProfile = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "name",
        `${formData.firstName} ${formData.lastName}`
      );
      formDataToSend.append("email", formData.email);
      formDataToSend.append("telephone", formData.phone);
      formDataToSend.append("adresse", formData.adresse);
      formDataToSend.append("ville", formData.ville);
      formDataToSend.append("region", formData.region);

      // ✅ si un nouveau fichier avatar a été choisi
      if (formData.avatarFile) {
        formDataToSend.append("avatar", formData.avatarFile);
      }

      const res = await api.put("/auth/me", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ⚡ Si ton back renvoie { user: {...} }
      const updatedUser = res.data.user || res.data;

      // 🔄 Mise à jour locale avec le nouvel avatar
      setUserData({ ...updatedUser, joinedDate: updatedUser.createdAt });
      setFormData((prev) => ({
        ...prev,
        avatar: updatedUser.avatar, // chemin avatar en BDD
        avatarFile: null, // reset input file
        avatarPreview: null, // reset preview
      }));

      setIsEditing(false);
      setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la sauvegarde",
      });
    }
  };

  // 🔹 Changement de mot de passe
  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Le nouveau mot de passe et la confirmation ne correspondent pas.",
      });
      return;
    }

    try {
      await api.put("/auth/me", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      setMessage({
        type: "success",
        text: "Mot de passe mis à jour avec succès !",
      });
      setFormData({
        ...formData,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la mise à jour",
      });
    }
  };

  // Dans ton composant, avant le return
  const roleFr = {
    consumer: "Consommateur",
    producer: "Producteur",
    admin: "Administrateur",
  };

  return (
      
    <div className="mt-20">
      <Navbar />
      <div className="max-w-4xl mb-8 mx-auto space-y-6">
        {/* ===== Header Profil ===== */}
        <div className="bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-xl shadow-xl flex flex-col md:flex-row items-center gap-6 hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <img
              src={
                userData.avatar
                  ? api.defaults.baseURL.replace("/api", "") + userData.avatar
                  : "/placeholder.svg"
              }
              alt="Avatar"
              className="w-40 h-40 rounded-full border-4 border-white shadow-md"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white animate-pulse"></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col sm:flex-row text-center sm:text-left gap-2 sm:gap-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="font-bold bg-green-200 rounded-2xl justify-center px-4 py-1 sm:mb-1">
                {roleFr[userData.role] || userData.role}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {formData.adresse},{" "}
                {formData.ville}, {formData.region}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Membre depuis{" "}
                {formatDate(userData.joinedDate)}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm">
              <div>
                <div className="font-semibold text-green-600">
                  {userData.totalOrders || 0}
                </div>
                <div className="text-gray-500">Commandes</div>
              </div>
              <div>
                <div className="font-semibold text-green-600">
                  {formatPrice(userData.totalSpent || 0)}
                </div>
                <div className="text-gray-500">Total dépensé</div>
              </div>
              <div>
                <div className="font-semibold text-green-600">
                  {userData.favoriteProducers || 0}
                </div>
                <div className="text-gray-500">Producteurs favoris</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-100 transition mt-4 md:mt-0"
          >
            <Settings className="w-4 h-4" />
            {isEditing ? "Annuler" : "Modifier"}
          </button>
        </div>

        {/* ===== Tabs ===== */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          {/* ---- Tab Buttons ---- */}
          <div className="flex border-b border-gray-200 mb-4">
            {[
              {
                key: "profile",
                label: "Profil",
                icon: <User className="inline w-4 h-4 mr-1" />,
              },
              {
                key: "orders",
                label: "Commandes",
                icon: <ShoppingBag className="inline w-4 h-4 mr-1" />,
              },
              {
                key: "favorites",
                label: "Favoris",
                icon: <Heart className="inline w-4 h-4 mr-1" />,
              },
              {
                key: "settings",
                label: "Paramètres",
                icon: <Settings className="inline w-4 h-4 mr-1" />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 text-center transition ${
                  activeTab === tab.key
                    ? "text-green-600 border-b-2 border-green-600 font-semibold bg-green-100"
                    : "text-gray-500"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ===== Tab Contents ===== */}
          {message && <AlertMessage type={message.type} text={message.text} />}

          {/* ---- Profil ---- */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ---- Champs classiques sauf Avatar ---- */}
              {[
                {
                  label: "Prénom",
                  value: "firstName",
                  icon: <User className="w-4 h-4 text-gray-400" />,
                },
                { label: "Nom", value: "lastName", icon: null },
                {
                  label: "Email",
                  value: "email",
                  icon: <Mail className="w-4 h-4 text-gray-400" />,
                },
                {
                  label: "Téléphone",
                  value: "phone",
                  icon: <Phone className="w-4 h-4 text-gray-400" />,
                },
                {
                  label: "Adresse",
                  value: "adresse",
                  icon: <MapPin className="w-4 h-4 text-gray-400" />,
                },
                { label: "Ville", value: "ville", icon: null },
              ].map((field) => (
                <div key={field.value} className="flex flex-col">
                  <label className="text-gray-600 mb-1">{field.label}</label>
                  <div className="relative">
                    {field.icon && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {field.icon}
                      </span>
                    )}
                    <input
                      type="text"
                      value={formData[field.value]}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.value]: e.target.value,
                        })
                      }
                      className={`w-full border rounded-lg px-3 py-2 ${
                        field.icon ? "pl-10" : ""
                      } focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
                    />
                  </div>
                </div>
              ))}

              {/* ---- Région ---- */}
              <div className="flex flex-col">
                <label className="text-gray-600 mb-1">Région</label>
                <input
                  type="text"
                  value={formData.region || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>

              {/* ---- Avatar à côté de Région ---- */}
              <div className="flex flex-col">
                <label className="text-gray-600 mb-1">Photo de profil</label>

                <div className="flex items-center gap-2">
                  {/* Bouton pour déclencher l'input */}
                  <button
                    type="button"
                    disabled={!isEditing}
                    onClick={() => {
                      const input = document.getElementById("avatarInput");
                      if (input) input.click();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Choisir une image
                  </button>

                  {/* Champ texte qui affiche le nom du fichier */}
                  <input
                    type="text"
                    value={
                      formData.avatarFile
                        ? formData.avatarFile.name // fichier choisi
                        : formData.avatar
                        ? formData.avatar.split("/").pop() // nom du fichier actuel
                        : ""
                    }
                    disabled
                    placeholder="Aucun fichier choisi"
                    className="flex-1 border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                  />
                </div>

                {/* Input file caché */}
                <input
                  type="file"
                  id="avatarInput"
                  style={{ display: "none" }} // s'assure qu'il est bien caché
                  disabled={!isEditing}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        avatarFile: file,
                        avatarPreview: URL.createObjectURL(file), // aperçu immédiat
                      });
                    }
                  }}
                  accept="image/*"
                />
              </div>

              {isEditing && (
                <div className="md:col-span-2 flex gap-3 mt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---- Commandes ---- */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Commande #{order.id}</div>
                      <div className="text-gray-500 text-sm">
                        {formatDate(order.date)} • {order.items} article
                        {order.items > 1 ? "s" : ""}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {order.producer}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatPrice(order.total)}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Livré"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---- Favoris ---- */}
          {activeTab === "favorites" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg hover:scale-105 transition"
                >
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-32 object-cover"
                    />
                    <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition">
                      <Heart className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-gray-500 text-sm mb-2">
                      {product.producer}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---- Paramètres ---- */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:shadow-md transition">
                <h4 className="font-semibold mb-2">Sécurité</h4>
                <div className="flex flex-col gap-3">
                  <input
                    type="password"
                    placeholder="Ancien mot de passe"
                    value={formData.oldPassword || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, oldPassword: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={formData.newPassword || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                  <input
                    type="password"
                    placeholder="Confirmer le nouveau mot de passe"
                    value={formData.confirmPassword || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Changer le mot de passe
                  </button>
                </div>

                <button className="w-full text-left px-3 py-2 border rounded-lg hover:bg-gray-50 transition mt-4">
                  Authentification à deux facteurs
                </button>
                <button className="w-full text-left px-3 py-2 border rounded-lg text-red-600 hover:bg-red-50 transition mt-2">
                  Supprimer le compte
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
