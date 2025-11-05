import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { ArrowUpDown, Edit3, Power, PowerOff, Loader2 } from "lucide-react";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        const sorted = res.data.sort((a, b) =>
          a.active === b.active ? 0 : a.active ? -1 : 1
        );
        setUsers(sorted);
        setFilteredUsers(sorted);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        toast.error("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    if (!value.trim()) return setFilteredUsers(users);
    const lower = value.toLowerCase();
    const filtered = users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(lower)) ||
        u.email.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  };

  const handleSort = (key) => {
    const asc = sortKey === key ? !sortAsc : true;
    setSortKey(key);
    setSortAsc(asc);
    const sorted = [...filteredUsers].sort((a, b) => {
      const valA = a[key] || "";
      const valB = b[key] || "";
      if (key === "createdAt")
        return asc
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    setFilteredUsers(sorted);
  };

  const handleEditUser = (userId) => navigate(`/users/${userId}/edit`);

  const handleToggleActive = async (userId) => {
    try {
      const res = await api.put(`/users/${userId}/toggle-active`);
      const updatedUser = res.data.user;
      const updated = users
        .map((u) => (u.id === userId ? updatedUser : u))
        .sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
      setUsers(updated);
      setFilteredUsers(updated);
      toast.success(
        updatedUser.active ? "Usuario activado" : "Usuario desactivado"
      );
    } catch (err) {
      console.error(err);
      toast.error("Error al cambiar estado");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col gap-2 items-center justify-center">
        <Loader2 className="animate-spin" size={28} />
        Cargando usuarios...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-indigo-400">
          Usuarios registrados
        </h2>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-gray-800 text-sm p-2 rounded-md w-full sm:w-64 focus:ring focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-750 text-gray-300 uppercase text-[11px]">
            <tr>
              <th className="py-2 px-3 text-left w-10">#</th>
              <th
                className="py-2 px-3 cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Nombre <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3 text-center">Plan</th>
              <th className="py-2 px-3 text-center">Licencias</th>
              <th className="py-2 px-3 text-center">Creado</th>
              <th
                className="py-2 px-3 cursor-pointer select-none text-center"
                onClick={() => handleSort("active")}
              >
                Estado <ArrowUpDown size={12} />
              </th>
              <th className="py-2 px-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="p-6 text-center text-gray-400 italic bg-gray-800"
                >
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filteredUsers.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-t border-gray-700 hover:bg-gray-700/40 transition ${
                    !u.active ? "opacity-70" : ""
                  }`}
                >
                  <td className="py-2 px-3 text-gray-400">{i + 1}</td>
                  <td className="py-2 px-3">{u.name || "-"}</td>
                  <td className="py-2 px-3 text-gray-300">{u.email}</td>
                  <td className="py-2 px-3 text-center">
                    {u.plan || (
                      <span className="italic text-gray-500">Sin plan</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {u.licenses?.length || 0}
                  </td>
                  <td className="py-2 px-3 text-center text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className={`py-2 px-3 text-center font-semibold ${
                      u.active ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {u.active ? "Activo" : "Inactivo"}
                  </td>
                  <td className="py-2 px-3 flex justify-center gap-1">
                    <button
                      onClick={() => handleEditUser(u.id)}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                      title="Editar usuario"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(u.id)}
                      className={`p-1.5 rounded ${
                        u.active
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      title={u.active ? "Desactivar" : "Activar"}
                    >
                      {u.active ? <PowerOff size={14} /> : <Power size={14} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
