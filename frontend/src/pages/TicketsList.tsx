import { useEffect, useState } from "react";
import { getTickets, type Ticket } from "../services/tickets.service";
import { Link } from "react-router-dom";
import { updateTicketStatus } from "../services/tickets.service";
import "./Tickets.css";

export default function TicketsList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTickets() {
            try {
                const data = await getTickets();
                setTickets(data);
            } finally {
                setLoading(false);
            }
        }

        loadTickets();
    }, []);

    if (loading) return <p>Carregando tickets...</p>;

    async function handleStatusChange(
        ticketId: string,
        newStatus: "OPEN" | "IN_PROGRESS" | "CLOSED"
    ) {
        try {
            await updateTicketStatus(ticketId, newStatus);

            setTickets((prev) =>
                prev.map((ticket) =>
                    ticket.id === ticketId
                        ? { ...ticket, status: newStatus }
                        : ticket
                )
            );
        } catch (error: any) {
            if (error.response?.status === 403) {
                alert("Você não tem permissão para atualizar o status deste ticket.");
                return;
            }

            alert("Erro inesperado ao atualizar status.");
        }
    }

    return (
        <div>
            <div className="tickets-header">
                <h1>Tickets</h1>
                <Link to="/tickets/new">
                    <button>Novo Ticket</button>
                </Link>
            </div>

            <div className="tickets-list">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                        <h3>{ticket.title}</h3>
                        <p>{ticket.description}</p>
                        <select
                            value={ticket.status}
                            onChange={(e) =>
                                handleStatusChange(
                                    ticket.id,
                                    e.target.value as "OPEN" | "IN_PROGRESS" | "CLOSED"
                                )
                            }
                            className={`status ${ticket.status}`}
                        >
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="CLOSED">CLOSED</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}