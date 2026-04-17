import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (roleRequired && userRole !== roleRequired) {
    return <Navigate to="/home" />;
  } 
  return children;
}
