import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Facebook, Twitter, Instagram } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Réinitialiser après 5 secondes
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      content: "+224 623 456 789",
      description: "Disponible du lundi au samedi"
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@guineelocalmarket.com",
      description: "Nous répondons sous 24h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "Conakry, Guinée",
      description: "Plateau, Rue du Commerce"
    },
    {
      icon: Clock,
      title: "Horaires",
      content: "Lun - Sam: 8h - 18h",
      description: "Dimanche: Fermé"
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous sommes à votre écoute pour toute question, suggestion ou préoccupation. 
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div>
            <h2 className="text-2xl font-semibold mb-8">Informations de contact</h2>
            
            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <Icon className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-900 font-medium">{item.content}</p>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Réseaux sociaux */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Carte (placeholder) */}
            <div className="mt-8 bg-green-200 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              <div className="text-center text-green-800">
                <MapPin size={32} className="mx-auto mb-2" />
                <p>Carte interactive</p>
                <p className="text-sm">Localisation de Guinée Local Market</p>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
              
              {isSubmitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  <p className="font-medium">Merci pour votre message !</p>
                  <p>Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="question">Question sur un produit</option>
                      <option value="order">Commande</option>
                      <option value="delivery">Livraison</option>
                      <option value="partnership">Partenariat</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Décrivez-nous votre demande..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-75 transition-all flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Informations supplémentaires */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  * Champs obligatoires. Nous nous engageons à traiter vos données personnelles 
                  avec respect et conformément à notre politique de confidentialité.
                </p>
              </div>
            </div>

            {/* FAQ rapide */}
            <div className="mt-8 bg-green-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Questions fréquentes</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Quels sont les délais de livraison ?</p>
                  <p className="text-sm text-gray-600">2-5 jours ouvrés dans tout le pays</p>
                </div>
                <div>
                  <p className="font-medium">Comment retourner un produit ?</p>
                  <p className="text-sm text-gray-600">7 jours pour changer d'avis</p>
                </div>
                <div>
                  <p className="font-medium">Paiement sécurisé ?</p>
                  <p className="text-sm text-gray-600">Tous nos paiements sont cryptés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;