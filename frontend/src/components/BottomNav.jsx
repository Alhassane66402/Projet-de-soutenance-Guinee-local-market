import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, User, Grid3X3, Heart, LayoutDashboard } from "lucide-react";
import { useApp } from "../hooks/useApp";

export default function BottomNav() {
  const { cartItemsCount, wishlistItemsCount, isLoggedIn, } = useApp();
  const location = useLocation();

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Accueil",
    },
  ];

  // Ajouter le dashboard après Accueil si connecté
  if (isLoggedIn) {
    navItems.push({
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    });
  }

  // Les autres liens
  navItems.push(
    {
      href: "/produits",
      icon: Grid3X3,
      label: "Produits",
    },
    {
      href: "/wishlist",
      icon: Heart,
      label: "Favoris",
      badge: wishlistItemsCount
    },
    {
      href: "/panier",
      icon: ShoppingCart,
      label: "Panier",
      badge: cartItemsCount
    }
  );

  // Ajouter le profil ou connexion à la fin
  navItems.push({
    href: isLoggedIn ? "/profile" : "/connexion",
    icon: User,
    label: isLoggedIn ? "Profil" : "Connexion",
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          let isActive = item.href === "/" 
            ? location.pathname === item.href 
            : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors relative ${
                isActive
                  ? "text-green-600 bg-green-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              {item.badge > 0 && (
                <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                  item.href === "/wishlist" ? "bg-red-500" : "bg-green-500"
                }`}>
                  {item.badge}
                </span>
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
