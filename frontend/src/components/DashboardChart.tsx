import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

export function DashboardChart({ open, inProgress, closed }: Props) {
  const data = {
    labels: ["Abertos", "Em Andamento", "Concluídos"],
    datasets: [
      {
        data: [open, inProgress, closed],
        backgroundColor: ["#f59e0b", "#4f8ef7", "#10b981"],
        borderColor: ["rgba(245,158,11,0.2)", "rgba(79,142,247,0.2)", "rgba(16,185,129,0.2)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <Doughnut data={data} />
    </div>
  );
}