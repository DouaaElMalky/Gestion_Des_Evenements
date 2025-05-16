import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarOrganisateur from "./NavbarOrganisateur";

function ParticipantsList() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Récupération des participants
  useEffect(() => {
    axios
      .get("http://localhost:9090/api/participants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setParticipants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des participants", error);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-lg font-semibold">Chargement des participants...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <NavbarOrganisateur />
      <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Liste des Utilisateurs
        </h2>
        {participants.length === 0 ? (
          <p className="text-center text-gray-500">Aucun utilisateur inscrit.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map((participant) => (
              <div
                key={participant._id}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600">
                  {participant.nom}
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Email :</strong> {participant.email}
                </p>
                
              
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipantsList;
