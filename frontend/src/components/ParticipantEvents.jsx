import React, { useState, useEffect } from "react";
import axios from "axios";

function ParticipantEvents() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/participants/events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEvents(response.data))
      .catch((error) => {
        console.error("Erreur lors de la récupération des événements", error);
      });
  }, [token]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Événements Inscrits</h3>
      <ul>
        {events.map((event) => (
          <li key={event._id} className="mb-2">
            {event.name} - {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParticipantEvents;
