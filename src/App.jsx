import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import UsersList from "./components/UsersList";
import LicensesList from "./components/LicensesList";
import UserForm from "./components/UserForm";
import LicenseForm from "./components/LicenseForm";
import Layout from "./pages/Layout";
import UserEditForm from "./components/UserEditForm";
import Loader from "./components/Loader";
import api from "./api/axios";
import { Toaster } from "react-hot-toast";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await api.get("/ping"); // usa una ruta simple de tu backend (podés cambiarla)
      } catch (error) {
        console.warn("Servidor no disponible:", error.message);
      } finally {
        setTimeout(() => setLoading(false), 500); // delay suave
      }
    };
    checkServer();
  }, []);

  if (loading) return <Loader />;

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rutas privadas dentro del Layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Layout>
                <UsersList />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/licenses"
          element={
            <PrivateRoute>
              <Layout>
                <LicensesList />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <PrivateRoute>
              <Layout>
                <UserForm />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/licenses/new"
          element={
            <PrivateRoute>
              <Layout>
                <LicenseForm />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <PrivateRoute>
              <UserEditForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
