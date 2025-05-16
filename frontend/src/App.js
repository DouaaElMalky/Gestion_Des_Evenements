import { Routes, Navigate, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Logout from "./components/Logout";
import EventList from "./components/EventList";
import EventCreate from "./components/EventCreate";
import Cart from "./components/Cart";
import EventParticipantsList from "./components/EventParticipantsList";
import ParticipantsList from "./components/UtilisateursList";
import PrivateRoute from "./components/PrivateRoute"; // Import du composant

function App() {

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      {/* Routes privées pour les organisateurs */}
      <Route
        path="/dashboard"
        element={<PrivateRoute element={<Dashboard />} allowedRoles={["organisateur"]} />}
      />
      <Route
        path="/create-event"
        element={<PrivateRoute element={<EventCreate />} allowedRoles={["organisateur"]} />}
      />
      <Route
        path="/events"
        element={<PrivateRoute element={<EventList />} allowedRoles={["organisateur"]} />}
      />
      
      <Route
        path="/participants"
        element={<PrivateRoute element={<ParticipantsList />} allowedRoles={["organisateur"]} />}
      />
      <Route
        path="/participants/:eventId"
        element={<PrivateRoute element={<EventParticipantsList />} allowedRoles={["organisateur"]} />}
      />

      {/* Routes privées pour les participants */}
      <Route
        path="/home"
        element={<PrivateRoute element={<Home />} allowedRoles={["participant"]} />}
      />
      <Route
        path="/cart"
        element={<PrivateRoute element={<Cart />} allowedRoles={["participant"]} />}
      />

      {/* Route par défaut si l'URL ne correspond à rien */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;
