import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function AppLayout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between",
        padding: "1rem",
        borderBottom: "1px solid #ccc"
      }}>
        <h2>Desk Sup App</h2>

        <div>
          <span style={{ marginRight: "1rem" }}>
            Olá, {user?.name}
          </span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}