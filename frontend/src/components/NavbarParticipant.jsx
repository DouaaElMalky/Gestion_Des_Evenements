import React from "react";
import { Link } from "react-router-dom";

function NavbarParticipant() {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <ul className="flex justify-around items-center">
        <li className="relative group">
          <Link
            to="/home"
            className="text-white font-medium transition-all duration-300 group-hover:text-sky-300"
          >
            Événements
          </Link>
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-sky-300 transition-all duration-300 group-hover:w-full"></span>
        </li>

        <li className="relative group">
          <Link
            to="/cart"
            className="text-white font-medium transition-all duration-300 group-hover:text-sky-300"
          >
            Mon agenda
          </Link>
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-sky-300 transition-all duration-300 group-hover:w-full"></span>
        </li>

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

export default NavbarParticipant;
