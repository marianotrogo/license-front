import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchStats();
  }, [month, year]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/reports", { params: { month, year } });
      setStats(res.data);
    } catch (err) {
      toast.error("Error al cargar estadísticas");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
        Panel Administrativo
      </h1>

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md text-sm focus:ring focus:ring-indigo-500"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md text-sm w-24 focus:ring focus:ring-indigo-500"
        />
      </div>

      {/* Cards */}
      {!stats ? (
        <p className="text-gray-400 text-sm">Cargando estadísticas...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 justify-items-center w-full max-w-5xl">
          <Card title="👥 Activos" value={stats.usersActivos} color="bg-green-600" />
          <Card title="🚫 Inactivos" value={stats.usersInactivos} color="bg-gray-600" />
          <Card title="🔑 Licencias" value={stats.licenciasActivas} color="bg-blue-600" />
          <Card title="⚠️ Por vencer" value={stats.licenciasPorVencer} color="bg-yellow-600" />
          <Card title="💾 Lifetime" value={stats.licenciasLifetime} color="bg-purple-600" />
          <Card title="📅 Mensuales" value={stats.licenciasMensuales} color="bg-teal-600" />
        </div>
      )}
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      className={`${color} aspect-square w-28 sm:w-32 md:w-36 rounded-xl flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200`}
    >
      <h2 className="text-xs sm:text-sm md:text-base font-medium opacity-90 text-center">{title}</h2>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
