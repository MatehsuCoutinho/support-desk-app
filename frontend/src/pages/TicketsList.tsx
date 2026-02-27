import { useEffect, useState } from "react";
import { getTickets, type Ticket } from "../services/tickets.service";
import { Link } from "react-router-dom";
import { updateTicketStatus } from "../services/tickets.service";
import CommentsSection from "../comments/CommentsSection";
import "./Tickets.css";

export default function TicketsList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedTicketId, setExpandedTicketId] = useState(null);

    function toggleComments(ticketId: any) {
        if (expandedTicketId === ticketId) {
            setExpandedTicketId(null);
        } else {
            setExpandedTicketId(ticketId);
        }
    }

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
                    <div key={ticket.id} className="ticket-card">
                        <h3>{ticket.title}</h3>

                        <p>Status: {ticket.status}</p>

                        <p>{ticket.description}</p>

                        <div className="ticket-actions">
                            <button onClick={() => handleStatusChange(ticket.id, "OPEN")}>
                                Abrir
                            </button>

                            <button onClick={() => handleStatusChange(ticket.id, "IN_PROGRESS")}>
                                Em andamento
                            </button>

                            <button onClick={() => handleStatusChange(ticket.id, "CLOSED")}>
                                Fechar
                            </button>

                            <button onClick={() => toggleComments(ticket.id)}>
                                {expandedTicketId === ticket.id
                                    ? "Fechar comentários"
                                    : "Ver comentários"}
                            </button>
                        </div>

                        {expandedTicketId === ticket.id && (
                            <CommentsSection ticketId={ticket.id} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}