import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { login, logout, token } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Token atual: {token}</p>

      <button onClick={() => login("TOKEN_FAKE_123")}>
        Simular Login
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}