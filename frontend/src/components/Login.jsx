import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  
  const [formData, setFormData] = useState({
    email: "",
    mdp: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9090/api/auth/login",
        formData
      );

      // Enregistrement du token et type dans localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("type", response.data.type);
      
      console.log("Type utilisateur :", response.data.type);

      // Redirection selon le type d'utilisateur avec rafraîchissement
      if (response.data.type === "organisateur") {
        window.location.href = "/dashboard"; // Rafraîchissement total
      } else {
        window.location.href = "/home";
      }
    } catch (error) {
      setMessage(
        error.response?.data.message || "Erreur lors de la connexion."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Se connecter
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            name="mdp"
            placeholder="Mot de passe"
            value={formData.mdp}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
        <div className="mt-4 text-center">
          <p>
            Vous n'avez pas de compte ?{" "}
            <Link to="/register" className="text-green-600 hover:text-blue-800">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
