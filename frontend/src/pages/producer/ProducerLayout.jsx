// src/pages/producer/ProducerLayout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "lucide-react";
import Footer from "../../components/Footer";
import ProducerSidebar from "../../components/producer/ProducerSidebar";
import Navbar from "../../components/Navbar";

const ProducerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <div
        className={`fixed top-12 left-0 w-64 h-full bg-white shadow-lg z-50 lg:hidden overflow-y-auto transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ProducerSidebar isMobile onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:block w-64 fixed top-15 left-0 h-full bg-white shadow-lg z-30">
        <ProducerSidebar />
      </div>

      {/* Bouton toggle mobile */}
      {!isSidebarOpen && (
        <button
          className="fixed top-15 left-4 z-40 lg:hidden p-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors cursor-pointer"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Sidebar size={20} />
        </button>
      )}

      {/* Contenu principal */}
      <main className="flex-1 ml-0 lg:ml-64 px-4 py-8 overflow-y-auto space-y-5">
        <Outlet key={location.pathname} />
        <Footer />
      </main>
    </div>
  );
};

export default ProducerLayout;