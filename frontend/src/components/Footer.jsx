import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, ArrowRight, Loader2, CheckCircle, Clock } from "lucide-react";

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
    <footer className="bg-gray-300 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 items-center md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="md:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <h3 className="text-3xl font-extrabold text-green-600">
                Guinée Local Market
              </h3>
              <Heart size={24} className="ml-2 text-green-400 fill-current animate-pulse" />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Votre marché en ligne pour découvrir et acheter les meilleurs produits locaux de Guinée.
              Nous connectons les producteurs locaux avec les amateurs de produits authentiques.
            </p>
            <div className="flex space-x-3 justify-center md:justify-start">
              <a href="#" className="p-3 rounded-full border border-green-400 text-green-600 hover:bg-green-600 hover:text-white transition-all transform hover:scale-110 shadow-lg">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-3 rounded-full border border-green-400 text-green-600 hover:bg-green-600 hover:text-white transition-all transform hover:scale-110 shadow-lg">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-3 rounded-full border border-green-400 text-green-600 hover:bg-green-600 hover:text-white transition-all transform hover:scale-110 shadow-lg">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links & Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:col-span-2 text-center md:text-left">
            {/* Quick Links */}
            <div className="mx-auto">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Navigation</h4>
              <ul className="space-y-2">
                {[
                  { path: "/", label: "Accueil" },
                  { path: "/produits", label: "Produits" },
                  { path: "/producteurs", label: "Prdoucteurs" },
                  { path: "/a-propos", label: "À propos" },
                  { path: "/contact", label: "Contact" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-gray-600 hover:text-green-600 transition-all flex items-center justify-center md:justify-start group"
                    >
                      <ArrowRight size={18} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
                      <span className="text-lg">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-gray-800">Contactez-nous</h4>
              <div className="space-y-2">
                {[
                  { icon: MapPin, text: "Conakry, Guinée" },
                  { icon: Phone, text: "+224 623 456 789" },
                  { icon: Mail, text: "contact@guineelocalmarket.com" },
                  { icon: Clock, text: "contact@guineelocalmarket.com" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center justify-center md:justify-start group">
                      <div className="bg-green-200/50 p-2 rounded-lg mr-3 group-hover:bg-green-600 transition-colors">
                        <Icon size={18} className="text-green-600 group-hover:text-white" />
                      </div>
                      <span className="text-gray-600 group-hover:text-green-600 transition-colors text-md">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        {/* Newsletter Subscription */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-left">
            <h4 className="text-2xl font-semibold mb-2 text-green-600">
              Restez informé
            </h4>
            <p className="text-gray-600 max-w-lg">
              Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et actualités
            </p>
          </div>

          <div className="w-full max-w-2xl">
            {isSubscribed ? (
              <div className="bg-green-200 border border-green-300 text-green-700 px-6 py-4 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="mr-3 text-green-500 animate-pulse" />
                <span className="text-lg font-medium">Merci ! Vous êtes maintenant inscrit à notre newsletter.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full gap-3">
                <div className="relative flex-grow">
                  <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all placeholder-gray-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center whitespace-nowrap shadow-lg hover:shadow-green-500/25 min-w-[140px] text-white"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                  ) : (
                    <>
                      <span>S'inscrire</span>
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Guinée Local Market. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/conditions"
              className="text-gray-600 hover:text-green-600 text-sm transition-colors hover:underline"
            >
              Conditions d'utilisation
            </Link>
            <Link
              to="/confidentialite"
              className="text-gray-600 hover:text-green-600 text-sm transition-colors hover:underline"
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
