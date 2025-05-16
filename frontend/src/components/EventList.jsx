import React, { useState, useEffect } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarOrganisateur from "./NavbarOrganisateur";

function EventList() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const navigate = useNavigate();

  // Récupérer la liste des événements
  useEffect(() => {
    axios
      .get("http://localhost:9090/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des événements", error));
  }, [token]);

  // Supprimer un événement
  const handleDelete = (eventId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      axios
        .delete(`http://localhost:9090/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setEvents(events.filter((event) => event._id !== eventId));
        })
        .catch((error) => console.error("Erreur lors de la suppression de l'événement", error));
    }
  };

  // Modifier un événement
  const handleEdit = (eventId) => {
    const eventToEdit = events.find((event) => event._id === eventId);
    setEditingEvent(eventToEdit);
  };

  // Sauvegarder les modifications
  const handleSaveEdit = () => {
    axios
      .put(
        `http://localhost:9090/api/events/${editingEvent._id}`,
        editingEvent,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setEvents(
          events.map((event) =>
            event._id === editingEvent._id ? editingEvent : event
          )
        );
        setEditingEvent(null);
      })
      .catch((error) => console.error("Erreur lors de la modification de l'événement", error));
  };

  // Annuler les modifications
  const handleCancelEdit = () => setEditingEvent(null);

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  // Afficher les participants d'un événement
  const viewParticipants = (eventId) => {
    navigate(`/participants/${eventId}`);
  };

  // Format de date : dd/mm/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredEvents = events
  .filter((event) =>
    event.nom.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => new Date(a.date) - new Date(b.date)); // Tri par date croissante


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <NavbarOrganisateur />
      <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Liste des Événements
        </h2>

        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un événement..."
            className="p-2 w-full border rounded"
          />
        </div>

        {/* Liste des événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isEventPast = new Date(event.date) < new Date();

            return (
              <div key={event._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                {editingEvent && editingEvent._id === event._id ? (
                  <div>
                    <label className="block mb-1 font-medium">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={editingEvent.nom}
                      onChange={handleChange}
                      className="p-2 w-full border rounded mb-2"
                    />
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                      name="description"
                      value={editingEvent.description}
                      onChange={handleChange}
                      className="p-2 w-full border rounded mb-2"
                    />
                    <label className="block mb-1 font-medium">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={
                          editingEvent.date && !isNaN(new Date(editingEvent.date).getTime())
                            ? new Date(editingEvent.date).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={handleChange}
                        className="p-2 w-full border rounded mb-2"
                      />
                    <label className="block mb-1 font-medium">Lien</label>
                    <input
                      type="url"
                      name="lien"
                      value={editingEvent.lien}
                      onChange={handleChange}
                      className="p-2 w-full border rounded mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                      <button onClick={handleSaveEdit} className="p-2 bg-blue-600 text-white rounded">
                        Sauvegarder
                      </button>
                      <button onClick={handleCancelEdit} className="p-2 bg-gray-400 text-white rounded">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-blue-600 text-lg mb-2">{event.nom}</h3>
                    <p className="text-gray-500 mb-2">
                      <strong>Description :</strong> {event.description}
                    </p>
                    <p className="text-gray-500 mb-2">
                      <strong>Date :</strong> {formatDate(event.date)}
                    </p>
                    <a href={event.lien} className="text-blue-600 hover:underline mb-4 block">
                      <strong className="text-gray-500">Lien :</strong> {event.lien}
                    </a>
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(event._id)} className="text-yellow-500 hover:text-yellow-700">
                        <PencilIcon className="w-6 h-6" />
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EventList;
