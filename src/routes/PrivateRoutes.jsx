import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "CLIENTE" && role !== "ADMIN") return <Navigate to="/login" replace />;
  return children;
}
