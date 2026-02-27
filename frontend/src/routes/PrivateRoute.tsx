import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function PrivateRoute({ children }: any) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}