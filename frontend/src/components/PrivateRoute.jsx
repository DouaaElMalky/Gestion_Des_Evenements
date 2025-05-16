import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");

  // Vérifier l'authentification
  if (!token) {
    return <Navigate to="/" />; // Redirige vers login si non connecté
  }

  // Vérifier le rôle de l'utilisateur
  if (!allowedRoles.includes(type)) {
    // Redirige vers la page par défaut du type utilisateur
    return type === "organisateur" ? (
      <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/home" />
    );
  }

  // Affiche la page demandée si autorisé
  return element;
};

export default PrivateRoute;
