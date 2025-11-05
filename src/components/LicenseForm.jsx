import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function LicenseForm() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [machineId, setMachineId] = useState("");
  const [planType, setPlanType] = useState("LOCAL");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    if (value.trim() === "") {
      setFiltered([]);
      return;
    }
    const lower = value.toLowerCase();
    setFiltered(users.filter((u) => u.email.toLowerCase().includes(lower)));
  };

  const handleCreateLicense = async (e) => {
    e.preventDefault();
    if (!selectedUser) return setError("Selecciona un usuario");

    try {
      setError("");
      const endpoint =
        planType === "LOCAL"
          ? "/licenses/generate-offline"
          : "/licenses-online/create";

      const body =
        planType === "LOCAL"
          ? { userId: selectedUser.id, machineId, type: planType }
          : { userId: selectedUser.id, planType };

      const res = await api.post(endpoint, body);
      setResult(res.data);
      setShowModal(true);
      toast.success("Licencia generada correctamente");
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear licencia");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 sm:p-8">
      <form
        onSubmit={handleCreateLicense}
        className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-2 sm:mb-4">
          Crear Licencia
        </h2>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* 🔍 Buscador de usuario */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Buscar usuario</label>
          <input
            type="text"
            placeholder="Buscar por email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-gray-700 p-2 rounded-md text-white outline-none focus:ring focus:ring-indigo-500 text-sm sm:text-base"
          />
          {filtered.length > 0 && (
            <div className="bg-gray-700 rounded-md mt-1 max-h-40 overflow-y-auto border border-gray-600">
              {filtered.map((u) => (
                <div
                  key={u.id}
                  className={`p-2 cursor-pointer hover:bg-gray-600 ${
                    selectedUser?.id === u.id ? "bg-gray-600" : ""
                  }`}
                  onClick={() => {
                    setSelectedUser(u);
                    setSearch(u.email);
                    setFiltered([]);
                  }}
                >
                  <p className="text-sm">
                    {u.email} —{" "}
                    <span className="text-gray-400">{u.name || "sin nombre"}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="text-xs text-gray-400">
            Usuario seleccionado: {selectedUser.email}
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Tipo de licencia</label>
          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
            className="bg-gray-700 p-2 rounded-md text-white outline-none focus:ring focus:ring-indigo-500 text-sm sm:text-base"
          >
            <option value="LOCAL">Offline (LOCAL)</option>
            <option value="MONTHLY">Mensual (ONLINE)</option>
            <option value="LIFETIME">De por vida</option>
          </select>
        </div>

        {planType === "LOCAL" && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Machine ID</label>
            <input
              type="text"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="bg-gray-700 p-2 rounded-md text-white outline-none focus:ring focus:ring-indigo-500 text-sm sm:text-base"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 py-2 rounded-md font-semibold transition text-sm sm:text-base"
        >
          Generar licencia
        </button>
      </form>

      {/* 🪟 Modal de resultado */}
      {showModal && result && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 relative text-center">
            <h3 className="text-lg font-semibold mb-3">Licencia generada ✅</h3>
            <div className="text-sm sm:text-base bg-gray-700 p-3 rounded-md text-left">
              <p>
                <span className="font-semibold">ShortCode:</span>{" "}
                {result.shortCode}
              </p>
              <p className="break-all">
                <span className="font-semibold">Token:</span>{" "}
                {result.token?.slice(0, 40)}...
              </p>
              {result.expiresAt && (
                <p>
                  <span className="font-semibold">Expira:</span>{" "}
                  {new Date(result.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-5">
              <button
                onClick={() => handleCopy(result.token)}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Copiar Token
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
