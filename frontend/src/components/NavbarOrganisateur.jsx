import React from "react";
import { Link } from "react-router-dom";

function NavbarOrganisateur() {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <ul className="flex justify-around items-center">
        {/* Tableau de bord */}
        <li className="relative group">
          <Link
            to="/dashboard"
            className="text-white font-medium transition-all duration-300 group-hover:text-sky-300"
          >
            Tableau de bord
          </Link>
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-sky-300 transition-all duration-300 group-hover:w-full"></span>
        </li>

        {/* Créer un événement */}
        <li className="relative group">
          <Link
            to="/create-event"
            className="text-white font-medium transition-all duration-300 group-hover:text-sky-300"
          >
            Créer un événement
          </Link>
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-sky-300 transition-all duration-300 group-hover:w-full"></span>
        </li>

        {/* Événements */}
        <li className="relative group">
          <Link
            to="/events"
            className="text-white font-medium transition-all duration-300 group-hover:text-sky-300"
          >
            Événements
          </Link>
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-sky-300 transition-all duration-300 group-hover:w-full"></span>
        </li>

        {/* Utilisateurs */}
        <li className="relative group">
          <Link
            to="/participants"
            className="text-white font-medium transition-all duration-300 group-hover:text-sky-300"
          >
            Utilisateurs
          </Link>
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-sky-300 transition-all duration-300 group-hover:w-full"></span>
        </li>

        {/* Se déconnecter */}
        <li className="relative group">
          <Link
            to="/logout"
            className="text-white font-medium transition-all duration-300 group-hover:text-red-400"
          >
            Se déconnecter
          </Link>
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
        </li>
      </ul>
    </nav>
  );
}

export default NavbarOrganisateur;
