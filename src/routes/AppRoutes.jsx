import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/pagEntrada/Login";
import { DefaultLayout } from "../components/DefaultLayout";
import Signup from "../pages/pagEntrada/Signup";
import { PrivateRoute } from "./PrivateRoutes";
import Home from "../pages/home";
export function AppRoutes() {
  const estaAutenticado = !!localStorage.getItem("token");

  return (
    <Routes>
      {/* ROTAS VAZIAS PADRONIZACAO */}
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* ROTAS PUBLICAS */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ROTAS PRIVADAS*/}
      <Route
        element={
          <PrivateRoute>
            <DefaultLayout />
          </PrivateRoute>
        }
      >
        <Route path="/financeiro" element={<PrivateRoute roleRequired="ADMIN"></PrivateRoute>} />
        <Route path="/estoque" element={<PrivateRoute roleRequired="ADMIN"></PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}
