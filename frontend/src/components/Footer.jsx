import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, ArrowRight } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulation d'un appel API
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
      // Réinitialiser après 5 secondes
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1500);
  };

  return (
    <footer className="bg-gradient-to-b from-green-700 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Guinée Local Market
              </h3>
              <Heart size={20} className="ml-2 text-green-300 fill-current" />
            </div>
            <p className="text-green-100 mb-6 max-w-md leading-relaxed">
              Votre marché en ligne pour découvrir et acheter les meilleurs produits locaux de Guinée. 
              Nous connectons les producteurs locaux avec les amateurs de produits authentiques.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-green-600 p-3 rounded-full hover:bg-green-500 transition-all transform hover:scale-105 shadow-md">
                <Facebook size={18} className="text-white" />
              </a>
              <a href="#" className="bg-green-600 p-3 rounded-full hover:bg-green-500 transition-all transform hover:scale-105 shadow-md">
                <Twitter size={18} className="text-white" />
              </a>
              <a href="#" className="bg-green-600 p-3 rounded-full hover:bg-green-500 transition-all transform hover:scale-105 shadow-md">
                <Instagram size={18} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 pb-2 border-b border-green-600">Navigation</h4>
            <ul className="space-y-3">
              {[
                { path: "/", label: "Accueil" },
                { path: "/produits", label: "Produits" },
                { path: "/a-propos", label: "À propos" },
                { path: "/contact", label: "Contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-green-100 hover:text-white transition-all flex items-center group py-1"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></div>
                    <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 pb-2 border-b border-green-600">Contactez-nous</h4>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: "Conakry, Guinée" },
                { icon: Phone, text: "+224 623 456 789" },
                { icon: Mail, text: "contact@guineelocalmarket.com" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start group">
                    <div className="bg-green-600 p-2 rounded-lg mr-3 group-hover:bg-green-500 transition-colors">
                      <Icon size={16} className="text-green-100" />
                    </div>
                    <span className="text-green-100 group-hover:text-white transition-colors pt-1">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-green-600">
          {isSubscribed ? (
            <div className="bg-green-500/20 border border-green-400 text-green-100 px-6 py-4 rounded-xl flex items-center justify-center">
              <Heart size={20} className="mr-3 text-green-300 fill-current" />
              <span className="text-lg">Merci ! Vous êtes maintenant inscrit à notre newsletter.</span>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-center lg:text-left">
                <h4 className="text-xl font-semibold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                  Restez informé
                </h4>
                <p className="text-green-100 max-w-md">
                  Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et actualités
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full max-w-2xl gap-3">
                <div className="relative flex-grow">
                  <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-green-500 bg-white/95 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all placeholder-green-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-75 transition-all flex items-center justify-center whitespace-nowrap shadow-lg hover:shadow-green-500/25 min-w-[140px]"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>S'inscrire</span>
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-200 text-sm">
            © 2023 Guinée Local Market. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              to="/conditions" 
              className="text-green-200 hover:text-white text-sm transition-colors hover:underline"
            >
              Conditions d'utilisation
            </Link>
            <Link 
              to="/confidentialite" 
              className="text-green-200 hover:text-white text-sm transition-colors hover:underline"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;