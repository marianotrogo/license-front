import { useEffect, useState } from "react";
import api from "../api/axios";
import dayjs from "dayjs";
import { MoreVertical, Copy } from "lucide-react";

export default function LicensesList() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  const loadLicenses = async () => {
    const res = await api.get("/licenses");
    setLicenses(res.data);
  };

  useEffect(() => {
    loadLicenses();
  }, []);

  const handleRenew = async (userId) => {
    if (!window.confirm("¿Renovar la licencia 30 días más?")) return;
    setLoading(true);
    try {
      await api.post(`/licenses/renew/${userId}`);
      alert("✅ Licencia renovada");
      loadLicenses();
    } catch {
      alert("❌ Error al renovar");
    } finally {
      setLoading(false);
    }
  };

  const daysUntilExpiration = (date) => {
    if (!date) return null;
    return dayjs(date).diff(dayjs(), "day");
  };

  const getRowColor = (l) => {
    if (!l.expiresAt) return "bg-gray-800";
    const d = daysUntilExpiration(l.expiresAt);
    if (d < 0) return "bg-red-900/30";
    if (d <= 7) return "bg-yellow-800/30";
    return "bg-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Licencias</h2>

      {/* 🌐 Tabla para escritorio */}
      <div className="hidden sm:block overflow-x-auto bg-gray-800 rounded-md border border-gray-700 shadow-lg">
        <table className="min-w-full text-xs sm:text-sm whitespace-nowrap">
          <thead className="bg-gray-750 text-gray-300 uppercase text-[11px]">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Expira</th>
              <th className="p-2 text-center">Renovar</th>
              <th className="p-2 text-center">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((l) => {
              const daysLeft = daysUntilExpiration(l.expiresAt);
              const canRenew = l.type === "MONTHLY" && daysLeft <= 7;
              const rowColor = getRowColor(l);
              return (
                <tr
                  key={l.id}
                  className={`${rowColor} border-t border-gray-700 hover:bg-gray-700/40 transition`}
                >
                  <td className="p-2">{l.id}</td>
                  <td className="p-2">{l.user?.email || "Sin usuario"}</td>
                  <td className="p-2">{l.type}</td>
                  <td className="p-2">
                    {l.expiresAt
                      ? `${new Date(l.expiresAt).toLocaleDateString()} (${daysLeft}d)`
                      : "Sin vencimiento"}
                  </td>
                  <td className="p-2 text-center">
                    {canRenew ? (
                      <button
                        onClick={() => handleRenew(l.user?.id)}
                        className="bg-green-600 hover:bg-green-700 text-xs px-2 py-0.5 rounded"
                      >
                        Renovar
                      </button>
                    ) : (
                      <span className="text-gray-500 text-xs italic">
                        No disponible
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => setSelectedLicense(l)}
                      className="hover:text-blue-400 transition"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 📱 Vista compacta móvil */}
      <div className="sm:hidden flex flex-col border border-gray-800 rounded-md divide-y divide-gray-800 bg-gray-850 overflow-hidden">
        {licenses.map((l) => {
          const daysLeft = daysUntilExpiration(l.expiresAt);
          const canRenew = l.type === "MONTHLY" && daysLeft <= 7;
          const rowColor = getRowColor(l);

          return (
            <div
              key={l.id}
              className={`${rowColor} flex justify-between items-center px-2 py-2 text-[13px]`}
            >
              <div className="flex flex-col">
                <span className="text-gray-300 font-medium truncate max-w-[150px]">
                  {l.user?.email || "Sin usuario"}
                </span>
                <span className="text-gray-500 text-[12px]">
                  {l.type} •{" "}
                  {l.expiresAt
                    ? `${new Date(l.expiresAt).toLocaleDateString()} (${daysLeft}d)`
                    : "Sin vencimiento"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {canRenew && (
                  <button
                    onClick={() => handleRenew(l.user?.id)}
                    className="bg-green-600 hover:bg-green-700 text-[11px] px-2 py-[2px] rounded"
                  >
                    ↻
                  </button>
                )}
                <button
                  onClick={() => setSelectedLicense(l)}
                  className="text-gray-400 hover:text-blue-400"
                >
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 💬 Modal flotante */}
      {selectedLicense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs sm:max-w-sm border border-gray-700 text-sm animate-fadeIn">
            <h3 className="text-center text-base font-semibold mb-3">
              ShortCode
            </h3>
            <p className="text-center text-gray-300 mb-3 break-all">
              {selectedLicense.notes || "Sin clave"}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(selectedLicense.notes || "")
                }
                className="bg-gray-700 hover:bg-gray-600 flex items-center justify-center gap-1 px-3 py-1 rounded text-xs"
              >
                <Copy size={12} /> Copiar
              </button>
              <button
                onClick={() => setSelectedLicense(null)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
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
