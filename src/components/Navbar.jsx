import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const toggleMenu = () => setOpen(!open);

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Título */}
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-indigo-400">
            Panel Admin
          </h1>
        </div>

        {/* Botón hamburguesa (solo en móvil) */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-gray-300 hover:text-white focus:outline-none"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Enlaces principales (desktop) */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/dashboard" className="hover:text-indigo-400 transition">
            Dashboard
          </Link>
          <Link to="/users" className="hover:text-indigo-400 transition">
            Usuarios
          </Link>
          <Link to="/licenses" className="hover:text-indigo-400 transition">
            Licencias
          </Link>
          <Link
            to="/users/new"
            className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded text-sm font-semibold"
          >
            + Usuario
          </Link>
          <Link
            to="/licenses/new"
            className="bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded text-sm font-semibold"
          >
            + Licencia
          </Link>
          <button
            onClick={handleLogout}
            className="ml-2 text-sm text-gray-400 hover:text-red-400 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Menú desplegable (mobile) */}
      {open && (
        <div className="sm:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 flex flex-col gap-3 text-sm animate-fadeIn">
          <Link
            to="/dashboard"
            onClick={toggleMenu}
            className="hover:text-indigo-400 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/users"
            onClick={toggleMenu}
            className="hover:text-indigo-400 transition"
          >
            Usuarios
          </Link>
          <Link
            to="/licenses"
            onClick={toggleMenu}
            className="hover:text-indigo-400 transition"
          >
            Licencias
          </Link>
          <Link
            to="/users/new"
            onClick={toggleMenu}
            className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded text-center font-semibold"
          >
            + Usuario
          </Link>
          <Link
            to="/licenses/new"
            onClick={toggleMenu}
            className="bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded text-center font-semibold"
          >
            + Licencia
          </Link>
          <button
            onClick={() => {
              toggleMenu();
              handleLogout();
            }}
            className="text-gray-400 hover:text-red-400 transition mt-1"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
