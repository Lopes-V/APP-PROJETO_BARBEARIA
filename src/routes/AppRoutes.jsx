import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/pagEntrada/Login";
import { DefaultLayout } from "../components/DefaultLayout";
import Signup from "../pages/pagEntrada/Signup";
import { PrivateRoute } from "./PrivateRoutes";
import { AdminRoute } from "./AdminRoute";
import Home from "../pages/private/Home";
import Agenda from "../pages/private/Agenda";
import Perfil from "../pages/private/Perfil";
import Financeiro from "../pages/private/Financeiro";
import Estoque from "../pages/private/Estoque";
import Barbeiros from "../pages/private/Barbeiros";

export function AppRoutes() {
  return (
    <Routes>
      {/* ROTAS VAZIAS PADRONIZACAO */}
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* ROTAS PUBLICAS */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        element={
          <PrivateRoute>
            <DefaultLayout />
          </PrivateRoute>
        }
      >
        {/* Acesso geral (usuário autenticado) */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <PrivateRoute>
              <Agenda />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        {/* Acesso exclusivo ADMIN */}
        <Route
          path="/financeiro"
          element={
            <AdminRoute>
              <Financeiro />
            </AdminRoute>
          }
        />
        <Route
          path="/estoque"
          element={
            <AdminRoute>
              <Estoque />
            </AdminRoute>
          }
        />
        <Route
          path="/barbeiros"
          element={
            <AdminRoute>
              <Barbeiros />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}
