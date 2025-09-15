import { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser, fetchUserProfile } from "../services/authService";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour normaliser le rôle de l'utilisateur
  const normalizeUserRole = (userData) => {
    if (!userData || !userData.role) return userData;
    
    return {
      ...userData,
      role: userData.role.toLowerCase()
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

      let userData = userFromLogin;
      
      // Si le backend ne renvoie pas l'utilisateur complet, on le récupère
      if (!userData) {
        userData = await fetchUserProfile();
      }
      
      // Normalisation du rôle
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

  // Fonction pour mettre à jour les données utilisateur
  const updateUser = (newUserData) => {
    const normalizedUser = normalizeUserRole(newUserData);
    setUser(normalizedUser);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ 
      isLoggedIn, 
      user, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;