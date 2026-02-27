import { useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AppLayout.css";

export function AppLayout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="layout">
      <header className="navbar">
        <h2>Support Desk</h2>

        <nav className="navbar-center">
          <NavLink to="/" className="nav-link">
            Dashboard
          </NavLink>

          <NavLink to="/tickets" className="nav-link">
            Tickets
          </NavLink>

          <NavLink to="/tickets/new" className="nav-link">
            Criar Ticket
          </NavLink>
        </nav>

        {/* 🔥 LADO DIREITO */}
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