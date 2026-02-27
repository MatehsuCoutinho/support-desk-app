import "./DashboardCard.css";

interface DashboardCardProps {
  title: string;
  value: string | number;
}

export function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}