// src/components/producer/OrderList.jsx
import React from "react";

const OrderList = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        Aucune commande trouvée.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-gray-800">
              Commande #{order._id.slice(-6)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              order.status === 'en_attente' ? 'bg-yellow-100 text-yellow-700' :
              order.status === 'traitee' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {order.status === 'en_attente' ? 'En attente' :
               order.status === 'traitee' ? 'Traitée' : 'Annulée'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Passée le : {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;