import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavbarOrganisateur from "./NavbarOrganisateur";

function EventParticipantsList() {
  const { eventId } = useParams(); 
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const selectedEvent = response.data.find((event) => event._id === eventId);
        setEvent(selectedEvent);

        // Récupérer les participants associés à cet événement
        const participantIds = selectedEvent.listeParticipants;
        if (participantIds.length > 0) {
          // Récupérer les détails des participants
          axios
            .get("http://localhost:9090/api/participants", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((participantResponse) => {
              const eventParticipants = participantResponse.data.filter((participant) =>
                participantIds.includes(participant._id)
              );
              setParticipants(eventParticipants);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Erreur lors de la récupération des participants", error);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des événements", error);
        setLoading(false);
      });
  }, [eventId, token]);

  if (loading) {
    return <div>Chargement des participants...</div>;
  }

  if (!event) {
    return <div>Événement non trouvé.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <NavbarOrganisateur />
      <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Participants pour : {event.nom}
        </h2>
        {participants.length === 0 ? (
          <p>Aucun participant inscrit à cet événement.</p>
        ) : (
          <ul className="space-y-4">
            {participants.map((participant) => (
              <li key={participant._id} className="p-4 bg-gray-200 rounded-md">
                <h3 className="font-bold">{participant.nom}</h3>
                <p>{participant.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EventParticipantsList;
