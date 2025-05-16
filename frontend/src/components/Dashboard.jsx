import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer as PieContainer,
} from "recharts";
import NavbarOrganisateur from "./NavbarOrganisateur";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/events/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des statistiques :",
          error
        );
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-lg font-semibold">Chargement...</h1>
      </div>
    );
  }

  // Couleurs pour les graphiques
  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <NavbarOrganisateur />
      <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Tableau de Bord des Événements
        </h1>

        {/* Graphe Global : Répartition des participants par événement */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Répartition des Participants 
          </h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={events}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickCount={11} // Définit 6 graduations (de 0 à 5)
                  domain={[0, 10]} // Limite les valeurs de 0 à 5
                  interval={0}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="presentiel" stackId="a" fill="#0088FE" name="Présentiel" />
                <Bar dataKey="enLigne" stackId="a" fill="#00C49F" name="En ligne"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Détails des événements */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Détails des Événements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              {/* Détails de l'événement */}
              <h3 className="text-lg font-bold text-blue-600 mb-4">
                {event.name}
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Date :</strong>{" "}
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Total Participants :</strong> {event.totalParticipants}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Présentiel :</strong> {event.presentiel}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>En ligne :</strong> {event.enLigne}
              </p>
              

              {/* Graphique individuel */}
              <div className="w-full h-48">
                <PieContainer width="100%" height="100%">
                  <PieChart>
                  <Tooltip />
                  <Legend />

                    <Pie
                      data={[
                        { name: "Présentiel", value: event.presentiel },
                        { name: "En ligne", value: event.enLigne },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#82ca9d"
                      dataKey="value"
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                      
                    </Pie>
                  </PieChart>
                </PieContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
