import { useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AppLayout.css";

export function AppLayout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="layout">
      <header className="navbar">
        <h2>Support<span>Desk</span></h2>

        <nav className="navbar-center">
          <NavLink to="/" end className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/tickets" end className="nav-link">
            Tickets
          </NavLink>
          <NavLink to="/tickets/new" className="nav-link">
            Criar Ticket
          </NavLink>
        </nav>

        <div className="navbar-right">
          <span>Olá, <strong>{user?.name}</strong></span>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}