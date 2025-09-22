import React, { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import { getNegotiations, sendMessage, confirmAgreement } from '../services/negotiationService';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/fr'; // Importez la locale française pour 'il y a X temps'

moment.locale('fr');

const NegotiationPage = () => {
  const { user, loading } = useApp();
  const [negotiations, setNegotiations] = useState([]);
  const [selectedNegotiation, setSelectedNegotiation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [agreedPrice, setAgreedPrice] = useState('');
  const [agreedQuantity, setAgreedQuantity] = useState('');

  useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        const data = await getNegotiations();
        setNegotiations(data.negotiations);
      } catch (err) {
        toast.error('Erreur lors de la récupération des négociations.');
      }
    };
    fetchNegotiations();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedNegotiation) return;

    try {
      await sendMessage(selectedNegotiation._id, messageText);
      
      // Mise à jour optimiste du state pour une meilleure UX
      const newMessage = {
        sender: { _id: user._id, name: user.name },
        text: messageText,
        timestamp: new Date().toISOString()
      };

      setSelectedNegotiation(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));
      setMessageText('');

    } catch (err) {
      toast.error('Erreur lors de l\'envoi du message.');
    }
  };

  const handleConfirmAgreement = async (e) => {
    e.preventDefault();
    if (!agreedPrice || !agreedQuantity || !selectedNegotiation) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    
    try {
      await confirmAgreement(selectedNegotiation._id, agreedPrice, agreedQuantity);
      toast.success('Accord validé et commande créée !');
      
      // Recharger les négociations pour mettre à jour le statut
      const updatedNegotiations = await getNegotiations();
      setNegotiations(updatedNegotiations.negotiations);
      setSelectedNegotiation(null); // Réinitialiser pour éviter les erreurs
      
    } catch (err) {
      toast.error('Erreur lors de la validation de l\'accord.');
    }
  };

  const getInterlocutor = (negotiation) => {
    return user.role === 'buyer' ? negotiation.producer : negotiation.buyer;
  };

  if (loading) {
    return <div className="text-center p-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Colonne de gauche : Liste des négociations */}
      <div className="w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-gray-200 bg-white shadow-sm rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Mes Négociations</h2>
        {negotiations.length === 0 ? (
          <p className="text-gray-500">Aucune négociation en cours.</p>
        ) : (
          <ul className="space-y-2">
            {negotiations.map((neg) => (
              <li
                key={neg._id}
                onClick={() => setSelectedNegotiation(neg)}
                className={`p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedNegotiation?._id === neg._id ? 'bg-green-100 border-green-500 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={neg.product.image || '/default-product.png'}
                      alt={neg.product.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <span className="text-sm">{neg.product.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-gray-500">
                      {getInterlocutor(neg).name}
                    </span>
                    <span className={`block text-xs font-medium ${neg.status === 'agreed' ? 'text-green-600' : 'text-orange-500'}`}>
                      {neg.status === 'agreed' ? 'Terminée' : 'En cours'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Colonne de droite : Discussion et actions */}
      <div className="w-full md:w-2/3 p-4 flex flex-col bg-white shadow-sm rounded-lg">
        {selectedNegotiation ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                Négociation pour "{selectedNegotiation.product.name}"
              </h2>
              {selectedNegotiation.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-lg max-w-lg ${
                    msg.sender.toString() === user._id.toString() ? 'bg-green-100 ml-auto' : 'bg-gray-200 mr-auto'
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {msg.sender.toString() === user._id.toString() ? 'Moi' : getInterlocutor(selectedNegotiation).name}
                  </p>
                  <p className="text-gray-800 break-words">{msg.text}</p>
                  <span className="block mt-1 text-xs text-gray-400 text-right">
                    {moment(msg.timestamp).fromNow()}
                  </span>
                </div>
              ))}
            </div>

            {/* Formulaires d'action en bas */}
            {selectedNegotiation.status === 'ongoing' ? (
              <>
                {/* Formulaire d'envoi de message */}
                <form onSubmit={handleSendMessage} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200"
                  >
                    Envoyer
                  </button>
                </form>

                {/* Formulaire de validation (visible pour les producteurs) */}
                {user.role === 'producer' && (
                  <form onSubmit={handleConfirmAgreement} className="p-4 border border-green-500 rounded-md bg-green-50">
                    <h3 className="text-lg font-semibold mb-2">Finaliser la commande</h3>
                    <div className="flex flex-col md:flex-row gap-4 mb-2">
                      <input
                        type="number"
                        placeholder="Prix convenu (GNF)"
                        value={agreedPrice}
                        onChange={(e) => setAgreedPrice(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="number"
                        placeholder="Quantité convenue"
                        value={agreedQuantity}
                        onChange={(e) => setAgreedQuantity(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Valider l'accord et créer la commande
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="p-4 bg-green-200 text-green-800 rounded-md font-semibold text-center">
                Cette négociation est terminée. L'accord a été validé. ✅
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-gray-500 text-center">
            <p>Sélectionnez une négociation dans la liste pour commencer à discuter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NegotiationPage;