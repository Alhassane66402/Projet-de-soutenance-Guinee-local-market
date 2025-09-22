// src/hooks/useApp.jsx
import { createContext, useState, useEffect, useContext } from "react";
import {
  loginUser,
  logoutUser,
  fetchUserProfile,
} from "../services/authService";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error(
        "Échec de la récupération du panier depuis le localStorage",
        error
      );
      return [];
    }
  });

  const [alert, setAlert] = useState({ type: null, message: null });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const normalizeUserRole = (userData) => {
    if (!userData || !userData.role) return userData;
    return {
      ...userData,
      role: userData.role.toLowerCase(),
    };
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userProfile = await fetchUserProfile();
          const normalizedUser = normalizeUserRole(userProfile);
          setUser(normalizedUser);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("❌ Erreur récupération profil :", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkUserStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user: userFromLogin } = await loginUser(credentials);
      localStorage.setItem("token", token);
      let userData = userFromLogin || (await fetchUserProfile());
      const normalizedUser = normalizeUserRole(userData);
      setUser(normalizedUser);
      setIsLoggedIn(true);
      return normalizedUser;
    } catch (err) {
      console.error("❌ Erreur login :", err);
      throw err;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  const updateUser = (newUserData) => {
    const normalizedUser = normalizeUserRole(newUserData);
    setUser(normalizedUser);
  };
  /**
   * Ajoute un produit au panier en s'assurant qu'il provient du même producteur.
   * La vérification gère les cas où l'ID du producteur est un objet ou une chaîne.
   * @param {object} product - Le produit à ajouter.
   * @param {number} quantity - La quantité à ajouter.
   */

  const addToCart = (product, quantity = 1) => {
    setAlert({ type: null, message: null }); // ✅ Normalisation de l'ID du producteur pour une comparaison cohérente

    const getProducerId = (item) => {
      if (!item || !item.producer) return null;
      const id =
        typeof item.producer === "object" ? item.producer._id : item.producer; // ✅ Conversion explicite de l'ID en chaîne de caractères
      return id ? id.toString() : null;
    };

    if (cart.length > 0) {
      const firstItemProducerId = getProducerId(cart[0]);
      const currentProductProducerId = getProducerId(product); // ✅ AJOUT DES LIGNES DE DÉBOGAGE

      console.log("-----------------------------------------");
      console.log("ID du producteur dans le panier:", firstItemProducerId);
      console.log(
        "ID du producteur du nouveau produit:",
        currentProductProducerId
      );
      console.log(
        "Les IDs sont-ils strictement identiques (===) ?",
        firstItemProducerId === currentProductProducerId
      );
      console.log("Type du premier ID:", typeof firstItemProducerId);
      console.log("Type du second ID:", typeof currentProductProducerId);
      console.log("-----------------------------------------"); // Si les IDs des producteurs ne correspondent pas, on bloque l'ajout.

      if (firstItemProducerId !== currentProductProducerId) {
        setAlert({
          type: "error",
          message:
            "Vous ne pouvez ajouter que des produits d'un seul producteur par commande. Veuillez d'abord commander ou vider ce que vous avez dans votre panier, puis vous pouvez commander avec un autre producteur.",
        });
        return;
      }
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });

    setAlert({
      type: "success",
      message: "Produit ajouté au panier avec succès !",
    });

    toast.success("Produit ajouté au panier !");
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    toast.info("Produit retiré du panier.");
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Panier vidé.");
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
               {" "}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
             {" "}
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateUser,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        cartTotal,
        alert,
        setAlert,
      }}
    >
            {children}   {" "}
    </AppContext.Provider>
  );
};

export function useApp() {
  return useContext(AppContext);
}
