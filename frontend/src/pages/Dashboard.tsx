import { DashboardCard } from "../components/DashboardCard";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <DashboardCard title="Total de Tickets" value={128} />
        <DashboardCard title="Abertos" value={34} />
        <DashboardCard title="Em Andamento" value={52} />
        <DashboardCard title="Concluídos" value={42} />
      </div>
    </div>
  );
}