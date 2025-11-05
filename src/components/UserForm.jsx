import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function UserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/users", { email, name, notes });
      setSuccess("✅ Usuario creado correctamente");
      setEmail("");
      setName("");
      setNotes("");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear usuario");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-xl w-full max-w-sm flex flex-col gap-4 border border-gray-700"
      >
        <h2 className="text-2xl font-semibold text-center text-indigo-400">
          Nuevo Usuario
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-950/40 py-1 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-400 text-sm text-center bg-green-950/40 py-1 rounded">
            {success}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 p-2 rounded-md text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 p-2 rounded-md text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Notas</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-gray-700 p-2 rounded-md text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[80px]"
            placeholder="Notas opcionales sobre el usuario..."
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md font-semibold transition mt-2"
        >
          Crear usuario
        </button>
      </form>
    </div>
  );
}
