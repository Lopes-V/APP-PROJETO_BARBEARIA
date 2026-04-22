import { Navigate } from "react-router-dom";

export function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (userRole !== "ADMIN") return <Navigate to="/home" replace />;

  return children;
}
