import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm bg-gray-800/90 backdrop-blur rounded-xl shadow-lg p-6 sm:p-8 border border-gray-700">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-white mb-6">
          Panel Administrativo
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition text-sm sm:text-base"
          >
            Ingresar
          </button>
        </form>

        <p className="text-gray-400 text-xs text-center mt-6">
          © {new Date().getFullYear()} Sistema de Gestión
        </p>
      </div>
    </div>
  );
}
