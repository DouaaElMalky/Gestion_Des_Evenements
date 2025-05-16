import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarParticipant from "./NavbarParticipant";

function Cart() {
  const [events, setEvents] = useState([]); // Liste des événements
  const [error, setError] = useState(""); // Gestion des erreurs

  // Récupérer les événements
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:9090/api/participants/events",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Trier du plus récent au plus loin
        const sortedEvents = response.data.sort(
          (a, b) => new Date(a.evenementId.date) - new Date(b.evenementId.date)
        );
        setEvents(sortedEvents); // Stocker les événements triés
      } catch (err) {
        console.error("Erreur lors de la récupération des événements :", err);
        setError("Erreur lors de la récupération des événements.");
      }
    };

    fetchEvents(); // Appel au chargement
  }, []); // Exécuter au montage uniquement

  // Supprimer un événement
  const handleRemoveEvent = async (eventId) => {
    const token = localStorage.getItem("token");

    // Confirmation avant suppression
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir vous désinscrire de cet événement ?"
    );

    if (!confirmation) return; // Annuler si l'utilisateur a refusé

    try {
      // Suppression côté serveur
      await axios.delete(`http://localhost:9090/api/participants/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mise à jour de la liste après suppression
      setEvents(events.filter((event) => event.evenementId._id !== eventId));
      alert("Vous vous êtes désinscrit avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression de l'événement :", err);
      alert("Erreur lors de la suppression de l'événement.");
    }
  };

  // Formater la date au format dd/mm/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <NavbarParticipant />
      <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
        <h1 className="text-3xl font-semibold text-center mb-4 text-gray-800">
          Mon Agenda d'Événements
        </h1>

        {/* Affichage des erreurs */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Affichage des événements */}
        {events.length === 0 ? (
          <p className="text-center text-gray-600">
            Vous n'êtes inscrit à aucun événement.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((eventWrapper) => {
              const event = eventWrapper.evenementId; // Détails de l'événement
              const mode = eventWrapper.modeParticipation; // Mode de participation

              return (
                <div
                  key={event._id}
                  className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Nom de l'événement */}
                    <h3 className="font-bold text-blue-600 text-lg mb-2">
                      {event.nom}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 mb-2">
                      <strong>Description :</strong> {event.description}
                    </p>

                    {/* Date */}
                    <p className="text-gray-500 mb-2">
                      <strong>Date :</strong> {formatDate(event.date)}
                    </p>

                    {/* Mode de participation */}
                    <p className="text-gray-500 mb-2">
                    <strong>Mode :</strong> {mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : "Non spécifié"}

                    </p>

                    {/* Lien en ligne si mode = en ligne */}
                    {mode === "en ligne" && event.lien && (
                      <p className="text-gray-500 mb-2">
                        <strong>Lien :</strong>{" "}
                        <a
                          href={event.lien}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {event.lien}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Bouton Se désinscrire aligné */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleRemoveEvent(event._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Se désinscrire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
