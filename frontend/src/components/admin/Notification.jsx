// src/components/admin/Notification.jsx
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Notification({ type = "success", message, onClose }) {
  // auto close après 3s
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bgColor = type === "error" ? "bg-red-100" : "bg-green-100";
  const textColor = type === "error" ? "text-red-700" : "text-green-700";
  const borderColor = type === "error" ? "border-red-200" : "border-green-200";

  return (
    <div className={`fixed top-15 right-4 p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor} shadow-lg flex items-center gap-3 max-w-sm w-full animate-slide-in`}>
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="hover:text-gray-600">
        <X size={20} />
      </button>
    </div>
  );
}
