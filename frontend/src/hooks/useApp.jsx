import { useContext } from "react";
// Importe le contexte que vous avez créé.
import { AppContext } from '../context/AppContext';

// Le hook personnalisé pour accéder facilement au contexte.
export function useApp() {
  return useContext(AppContext);
}