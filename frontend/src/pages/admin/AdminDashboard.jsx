
import { User, Package, ShoppingBag } from "lucide-react";

// Données statiques
const adminStats = [
  { label: "Utilisateurs", value: 125, icon: User, color: "text-blue-600", bgColor: "bg-blue-100" },
  { label: "Commandes", value: 45, icon: ShoppingBag, color: "text-green-600", bgColor: "bg-green-100" },
  { label: "Produits", value: 205, icon: Package, color: "text-purple-600", bgColor: "bg-purple-100" },
];

const recentOrders = [
  { id: "#12348", client: "Fatoumata Sylla", status: "En cours", total: "150 000 GNF" },
  { id: "#12347", client: "Lamine Barry", status: "Livré", total: "85 000 GNF" },
  { id: "#12346", client: "Aissatou Diallo", status: "En attente", total: "250 000 GNF" },
  { id: "#12345", client: "Alpha Oumar", status: "Livré", total: "40 000 GNF" },
];

const AdminDashboard = () => {

  return (
    <div>
      {/* Contenu principal */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Tableau de bord Admin</h1>

        {/* Statistiques */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {adminStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color} mr-4`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                  <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Dernières commandes */}
        <section className="overflow-x-auto mt-5 mb-5 bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold">Dernières commandes</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">{order.client}</td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Livré"
                          ? "bg-green-100 text-green-800"
                          : order.status === "En cours"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
    </div>
  );
};

export default AdminDashboard;
