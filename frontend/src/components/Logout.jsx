import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setMessage("Vous êtes maintenant déconnecté.");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, [navigate]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Déconnexion</h2>
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
}

export default Logout;
