import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function UserEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
    lastName: "",
    phone: "",
    notes: "",
    plan: "ELEGIR_DESPUES",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setForm({
          email: res.data.email || "",
          name: res.data.name || "",
          lastName: res.data.lastName || "",
          phone: res.data.phone || "",
          notes: res.data.notes || "",
          plan: res.data.plan || "ELEGIR_DESPUES",
        });
      } catch {
        setError("Error al cargar el usuario");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        plan: form.plan === "ELEGIR_DESPUES" ? null : form.plan,
      };

      await api.put(`/users/${id}`, payload);
      setSuccess("Usuario actualizado correctamente ✅");
      setTimeout(() => navigate("/users"), 1500);
    } catch {
      setError("Error al actualizar el usuario");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
        Cargando usuario...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 w-full max-w-md sm:max-w-lg rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col gap-4"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-2">
          Editar Usuario
        </h2>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center">{success}</p>}

        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="bg-gray-700 p-2.5 rounded-md text-white text-sm sm:text-base outline-none focus:ring focus:ring-indigo-500"
            required
          />
        </div>

        {/* Apellido */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Apellido</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="bg-gray-700 p-2.5 rounded-md text-white text-sm sm:text-base outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="bg-gray-700 p-2.5 rounded-md text-white text-sm sm:text-base outline-none focus:ring focus:ring-indigo-500"
            required
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Teléfono</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+54 9 ..."
            className="bg-gray-700 p-2.5 rounded-md text-white text-sm sm:text-base outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        {/* Plan */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Tipo de plan</label>
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="bg-gray-700 p-2.5 rounded-md text-white text-sm sm:text-base outline-none focus:ring focus:ring-indigo-500"
          >
            <option value="ELEGIR_DESPUES">Elegir después</option>
            <option value="MONTHLY">Mensual</option>
            <option value="LIFETIME">De por vida</option>
            <option value="LOCAL">Local (offline)</option>
          </select>
        </div>

        {/* Notas */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-1">Notas</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Información adicional..."
            rows={3}
            className="bg-gray-700 p-2.5 rounded-md text-white text-sm sm:text-base outline-none focus:ring focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md font-semibold transition text-sm sm:text-base"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="bg-gray-700 hover:bg-gray-600 py-2 rounded-md font-semibold transition text-sm sm:text-base"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
