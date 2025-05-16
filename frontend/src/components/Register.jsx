import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mdp: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9090/api/participants",
        formData
      ); // Inscription API
      alert("Inscription réussie !");
    
    // Redirection vers la page de connexion
    navigate("/");
    } catch (error) {
      setMessage(
        error.response.data.message || "Erreur lors de l'inscription."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">S'inscrire</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
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
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">S'inscrire</button>
        </form>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
        <div className="mt-4 text-center">
          <p>
            Vous avez deja de compte ?{" "}
            <Link to="/" className="text-green-600 hover:text-blue-800">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
