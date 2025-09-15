import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Search,
} from "lucide-react";
import { useApp } from "../hooks/useApp";

export default function Navbar() {
  const { isLoggedIn, user, logout, loading } = useApp();
  const [isOpen, setIsOpen] = useState(false); // ✅ corrigé
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const cartItemsCount = 2; // à remplacer par le vrai contexte si nécessaire
  const wishlistItemsCount = 1; // idem

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gestion click en dehors pour fermer menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("button[aria-controls='mobile-menu']")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
    setIsOpen(false);
  }, [logout]);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // **Afficher rien tant que le contexte charge**
  if (loading) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-white shadow-sm py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-0">
          <div className="flex items-center justify-between h-8 md:h-10">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl md:text-xl font-bold text-green-600 flex-shrink-0 whitespace-nowrap"
            >
              Guinée Local Market
            </Link>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center flex-1 justify-center space-x-1 xl:space-x-2 mx-2">
              <div className="relative w-40 xl:w-64">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-3 xl:pl-4 pr-3 xl:pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link
                to="/"
                className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === "/"
                    ? "text-green-600 bg-green-100"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-100"
                }`}
              >
                Accueil
              </Link>
              <Link
                to="/produits"
                className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname.includes("/produits")
                    ? "text-green-600 bg-green-100"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-100"
                }`}
              >
                Produits
              </Link>
              <Link
                to="/producteurs"
                className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === "/producteurs"
                    ? "text-green-600 bg-green-100"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-100"
                }`}
              >
                Producteurs
              </Link>
              <Link
                to="/a-propos"
                className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === "/a-propos"
                    ? "text-green-600 bg-green-100"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-100"
                }`}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === "/contact"
                    ? "text-green-600 bg-green-100"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-100"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Burger + Bouton recherche mobile + Panier / Favoris */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                className="p-2 rounded-md text-gray-700 hover:bg-green-100"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                <Search size={20} />
              </button>

              {/* Favoris */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-md hover:bg-green-100 text-gray-700"
              >
                <Heart size={20} />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Panier */}
              <Link
                to="/panier"
                className="relative p-2 rounded-md hover:bg-green-100 text-gray-700"
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Burger */}
              <button
                className="p-2 rounded-md text-gray-700 hover:bg-green-100"
                onClick={() => setIsOpen(!isOpen)}
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Menu utilisateur Desktop */}
            {/* Desktop Right */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
              {/* Favoris */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-md hover:bg-green-100 text-gray-700 hover:text-red-500"
              >
                <Heart size={20} />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Panier */}
              <Link
                to="/panier"
                className="relative p-2 rounded-md hover:bg-green-100 text-gray-700 hover:text-green-600"
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Menu utilisateur */}
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-green-100"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-controls="user-menu-dropdown"
                >
                  <User size={20} />
                </button>

                {isUserMenuOpen && (
                  <div
                    id="user-menu-dropdown"
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-10"
                  >
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-2 text-xs text-gray-500 border-b">
                          Connecté en tant que{" "}
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-600 whitespace-nowrap"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard size={16} className="mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-600 whitespace-nowrap"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={16} className="mr-2" />
                          Profil
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-600 whitespace-nowrap"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <History size={16} className="mr-2" />
                          Mes commandes
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-600 whitespace-nowrap"
                        >
                          <LogOut size={16} className="mr-2" />
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/connexion"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-600 whitespace-nowrap"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={16} className="mr-2" />
                          Connexion
                        </Link>
                        <Link
                          to="/inscription"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-600 whitespace-nowrap"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={16} className="mr-2" />
                          Inscription
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          className={`${isOpen ? "block" : "hidden"} lg:hidden`}
          id="mobile-menu"
          ref={mobileMenuRef}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/produits"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Produits
            </Link>
            <Link
              to="/producteurs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Producteurs
            </Link>
            <Link
              to="/a-propos"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
              onClick={() => setIsOpen(false)}
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {/* Menu utilisateur mobile */}
            <div className="mt-2 border-t border-gray-200 pt-2">
              {isLoggedIn ? (
                <>
                  <p className="px-3 py-2 text-gray-500 text-sm">
                    Connecté en tant que{" "}
                    <span className="font-medium">{user.name}</span>
                  </p>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Mes commandes
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-green-100 hover:text-green-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Barre de recherche Mobile */}
        {isMobileSearchOpen && (
          <div className="lg:hidden px-2 py-2">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </nav>
    </>
  );
}
