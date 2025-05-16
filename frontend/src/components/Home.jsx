import React, { useEffect, useState } from "react";
import NavbarParticipant from "./NavbarParticipant";
import axios from "axios";

function Home() {
  const token = localStorage.getItem("token");
  const [events, setEvents] = useState([]); // Liste des événements
  const [selectedEvent, setSelectedEvent] = useState(null); // Événement sélectionné
  const [modeParticipation, setModeParticipation] = useState(""); // Mode sélectionné
  const [participantInfo, setParticipantInfo] = useState({
    nom: "",
    email: "",
    evenementId: [], // Stocker les événements auxquels il est inscrit
  });
  const [searchQuery, setSearchQuery] = useState(""); // Barre de recherche

  // Charger les informations du participant et les événements
  useEffect(() => {
    const fetchParticipantInfo = async () => {
      try {
        const response = await axios.get("http://localhost:9090/api/participants/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParticipantInfo(response.data); // Charger les infos du participant
      } catch (error) {
        console.error("Erreur lors de la récupération des informations :", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:9090/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data); // Charger les événements
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      }
    };

    fetchParticipantInfo(); // Infos participant
    fetchEvents(); // Liste événements
  }, [token]);

  const addToCart = async () => {
    try {
      // Étape 1 : Vérifier l'inscription côté serveur
      const response = await axios.get(
        "http://localhost:9090/api/participants/events", // Route pour récupérer les événements inscrits
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Vérifier si l'événement sélectionné est déjà inscrit
      const isRegistered = response.data.some(
        (event) => event._id === selectedEvent._id
      );
  
      if (isRegistered) {
        alert("Vous êtes déjà inscrit à cet événement.");
        setSelectedEvent(null); // Fermer la modal
        return; // Sortir immédiatement
      }
  
      // Étape 2 : Envoi de la requête POST pour inscrire le participant
      await axios.post(
        "http://localhost:9090/api/participants/inscrire",
        {
          eventId: selectedEvent._id,
          modeParticipation, // Ajouter le mode de participation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Étape 3 : Afficher un message de succès
      alert("Inscription réussie !");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
  
      // Gestion des erreurs avec des messages clairs
      if (error.response && error.response.data && error.response.data.message) {
        alert(`${error.response.data.message}`);
      } else {
        alert("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
  
    // Étape 4 : Fermer la modal après traitement
    setSelectedEvent(null);
  };
  

  
  
  // Mise à jour de la recherche
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Formatter la date au format dd/mm/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredEvents = events
  .filter((event) =>
    event.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => new Date(a.date) - new Date(b.date));



  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <NavbarParticipant />
      <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Liste des événements
        </h2>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher un événement..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 w-full mb-4 border rounded"
        />

        {/* Affichage des événements en cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              <h3 className="font-bold text-blue-600 text-lg mb-2">
                {event.nom}
              </h3>
              <p className="text-gray-500 mb-2">
                <strong>Description :</strong> {event.description}
              </p>
              <p className="text-gray-500 mb-2">
                <strong>Date :</strong> {formatDate(event.date)}
              </p>
              <a
                href={event.lien}
                className="text-blue-600 hover:underline mb-4 block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong className="text-gray-500">Lien :</strong> {event.lien}
              </a>
              <button
                onClick={() => {
                  setSelectedEvent(event);
                  setModeParticipation("");
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                S'inscrire
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal d'inscription */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Inscription</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  value={participantInfo.nom} // Prérempli
                  className="mt-1 p-2 w-full border rounded"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={participantInfo.email} // Prérempli
                  className="mt-1 p-2 w-full border rounded"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Événement</label>
                <input
                  type="text"
                  value={selectedEvent.nom}
                  disabled
                  className="mt-1 p-2 w-full border rounded bg-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mode de participation</label>
                <select
                  value={modeParticipation}
                  onChange={(e) => setModeParticipation(e.target.value)}
                  required
                  className="mt-1 p-2 w-full border rounded"
                >
                  <option value="">Sélectionner...</option>
                  <option value="en ligne">En ligne</option>
                  <option value="présentiel">Présentiel</option>
                </select>
              </div>
            </form>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={addToCart}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
