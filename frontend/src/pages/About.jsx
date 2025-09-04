import React from "react";
import { Users, Target, Globe, Heart } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Users,
      title: "Notre Mission",
      description: "Connecter les producteurs locaux guinéens avec des consommateurs à la recherche de produits authentiques et de qualité."
    },
    {
      icon: Target,
      title: "Notre Vision",
      description: "Devenir la plateforme de référence pour la promotion et la commercialisation des produits du terroir guinéen."
    },
    {
      icon: Globe,
      title: "Notre Impact",
      description: "Contribuer au développement économique local en soutenant les artisans et producteurs de toutes les régions de la Guinée."
    },
    {
      icon: Heart,
      title: "Nos Valeurs",
      description: "Authenticité, qualité, équité et respect de l'environnement sont au cœur de notre démarche."
    }
  ];

  const team = [
    { name: "Mamadou Diallo", role: "Fondateur & CEO", image: "https://via.placeholder.com/150?text=Mamadou" },
    { name: "Fatoumata Binta", role: "Responsable Relations Producteurs", image: "https://via.placeholder.com/150?text=Fatoumata" },
    { name: "Ibrahima Sarr", role: "Responsable Logistique", image: "https://via.placeholder.com/150?text=Ibrahima" },
    { name: "Aïssatou Bah", role: "Responsable Clientèle", image: "https://via.placeholder.com/150?text=Aïssatou" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">À propos de Guinée Local Market</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Nous sommes une plateforme dédiée à la promotion et à la commercialisation des produits 
          locaux guinéens. Notre mission est de valoriser le savoir-faire local et de le rendre 
          accessible à tous.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Icon className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Story Section */}
      <div className="bg-green-50 rounded-lg p-8 mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Notre Histoire</h2>
          <div className="prose prose-lg mx-auto">
            <p className="mb-4">
              Fondé en 2020, Guinée Local Market est né d'un constat simple : les producteurs locaux 
              peinent souvent à écouler leurs produits tandis que les consommateurs recherchent 
              activement des produits authentiques et de qualité.
            </p>
            <p className="mb-4">
              Notre plateforme a été créée pour servir de pont entre ces deux mondes, en mettant 
              en valeur la richesse et la diversité des produits guinéens. Aujourd'hui, nous 
              travaillons avec plus de 200 producteurs répartis dans les quatre régions naturelles 
              de la Guinée.
            </p>
            <p>
              Chaque produit que nous proposons raconte une histoire, celle de femmes et d'hommes 
              passionnés qui perpétuent des traditions ancestrales tout en innovant pour répondre 
              aux défis contemporains.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Notre Équipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-green-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 text-white rounded-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold mb-2">200+</p>
            <p className="text-green-100">Producteurs</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">500+</p>
            <p className="text-green-100">Produits</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">4</p>
            <p className="text-green-100">Régions couvertes</p>
          </div>
          <div>
            <p className="text-4xl font-bold mb-2">1000+</p>
            <p className="text-green-100">Clients satisfaits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;