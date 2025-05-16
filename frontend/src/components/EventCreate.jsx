import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarOrganisateur from "./NavbarOrganisateur";

function EventCreate() {
  const [eventData, setEventData] = useState({
    nom: "",
    description: "",
    date: "",
    lien: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:9090/api/events", eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Événement créé avec succès !");
        navigate("/events");
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la création de l'événement",
          error.response ? error.response.data : error
        );
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <NavbarOrganisateur />
      <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Créer un événement
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nom" className="block text-sm font-medium">
              Nom de l'événement
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={eventData.nom}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium">
              Date de l'événement
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded"
            />
          </div>

          
          <div className="mb-4">
            <label className="block text-sm font-medium">Lien (facultatif)</label>
            <input
              type="url"
              name="lien"
              value={eventData.lien}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded"
          >
            Créer l'événement
          </button>
        </form>
      </div>
    </div>
  );
}

export default EventCreate;
