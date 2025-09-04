import { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser, fetchUserProfile } from "../services/authService";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userProfile = await fetchUserProfile(); // pas besoin de passer token
          setUser(userProfile);
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
      const { token, user } = await loginUser(credentials);
      localStorage.setItem("token", token);

      if (user) {
        // si le backend renvoie déjà l’utilisateur
        setUser(user);
      } else {
        // sinon on recharge depuis /auth/me
        const userProfile = await fetchUserProfile();
        setUser(userProfile);
      }

      setIsLoggedIn(true);
    } catch (err) {
      console.error("❌ Erreur login :", err);
      throw err;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsLoggedIn(false);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <AppContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};
