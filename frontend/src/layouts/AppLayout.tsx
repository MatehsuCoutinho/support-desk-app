import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AppLayout.css";

export function AppLayout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="layout">
      <header className="navbar">
        <h2>Support Desk</h2>

        <div className="navbar-right">
          <span>Olá, {user?.name}</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}