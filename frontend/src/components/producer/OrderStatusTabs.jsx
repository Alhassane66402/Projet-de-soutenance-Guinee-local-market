// src/components/producer/OrderStatusTabs.jsx
import React from "react";

const OrderStatusTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "pending", label: "En attente" },
    { id: "processed", label: "Traitées" },
    { id: "canceled", label: "Annulées" },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-2 px-4 -mb-px text-sm font-medium border-b-2 transition-colors duration-200 ease-in-out ${
            activeTab === tab.id
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default OrderStatusTabs;