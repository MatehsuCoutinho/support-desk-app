import { useEffect, useState } from "react";
import { DashboardCard } from "../components/DashboardCard";
import { getTickets, type Ticket } from "../services/tickets.service";
import { DashboardChart } from "../components/DashboardChart";
import "./Dashboard.css";

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const lastFiveTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTickets();
        setTickets(data);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading)
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <span>Carregando dashboard...</span>
      </div>
    );

  const total = tickets.length;
  const open = tickets.filter(t => t.status === "OPEN").length;
  const inProgress = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const closed = tickets.filter(t => t.status === "CLOSED").length;

  const statusLabel: Record<string, string> = {
    OPEN: "Aberto",
    IN_PROGRESS: "Em Andamento",
    CLOSED: "Concluído",
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Visão Geral</p>
          <h1 className="dashboard-title">Dashboard</h1>
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardCard title="Total de Tickets" value={total} />
        <DashboardCard title="Abertos" value={open} />
        <DashboardCard title="Em Andamento" value={inProgress} />
        <DashboardCard title="Concluídos" value={closed} />
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-chart">
          <h2 className="section-title">Distribuição</h2>
          <DashboardChart
            open={open}
            inProgress={inProgress}
            closed={closed}
          />
        </div>

        <div className="dashboard-recent">
          <h2 className="section-title">Últimos 5 Tickets</h2>

          <div className="recent-list">
            {lastFiveTickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="recent-item"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="recent-item-left">
                  <span className="recent-item-index">#{String(index + 1).padStart(2, "0")}</span>
                  <div className="recent-item-content">
                    <strong>{ticket.title}</strong>
                    <p>{ticket.description}</p>
                  </div>
                </div>

                <span className={`status-badge status-badge--${ticket.status}`}>
                  {statusLabel[ticket.status] ?? ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}