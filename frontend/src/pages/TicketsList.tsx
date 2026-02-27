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

    if (loading)
        return (
            <div className="tickets-loading">
                <div className="loading-spinner" />
                <span>Carregando tickets...</span>
            </div>
        );

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

    const statusLabel: Record<string, string> = {
        OPEN: "Aberto",
        IN_PROGRESS: "Em Andamento",
        CLOSED: "Concluído",
    };

    return (
        <div className="tickets-page">
            <div className="tickets-header">
                <div>
                    <p className="tickets-eyebrow">Gerenciamento</p>
                    <h1 className="tickets-title">Tickets</h1>
                </div>
                <Link to="/tickets/new">
                    <button className="btn-new-ticket">+ Novo Ticket</button>
                </Link>
            </div>

            <div className="tickets-list">
                {tickets.map((ticket, index) => (
                    <div
                        key={ticket.id}
                        className="ticket-card"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="ticket-card-top">
                            <div className="ticket-card-info">
                                <h3 className="ticket-title">{ticket.title}</h3>
                                <p className="ticket-description">{ticket.description}</p>
                            </div>
                            <span className={`status-badge status-badge--${ticket.status}`}>
                                {statusLabel[ticket.status] ?? ticket.status}
                            </span>
                        </div>

                        <div className="ticket-divider" />

                        <div className="ticket-actions">
                            <div className="ticket-status-actions">
                                <button
                                    className={`btn-status btn-open ${ticket.status === "OPEN" ? "active" : ""}`}
                                    onClick={() => handleStatusChange(ticket.id, "OPEN")}
                                >
                                    Abrir
                                </button>
                                <button
                                    className={`btn-status btn-progress ${ticket.status === "IN_PROGRESS" ? "active" : ""}`}
                                    onClick={() => handleStatusChange(ticket.id, "IN_PROGRESS")}
                                >
                                    Em andamento
                                </button>
                                <button
                                    className={`btn-status btn-close ${ticket.status === "CLOSED" ? "active" : ""}`}
                                    onClick={() => handleStatusChange(ticket.id, "CLOSED")}
                                >
                                    Fechar
                                </button>
                            </div>

                            <button
                                className="btn-comments"
                                onClick={() => toggleComments(ticket.id)}
                            >
                                {expandedTicketId === ticket.id ? "▲ Comentários" : "▼ Comentários"}
                            </button>
                        </div>

                        {expandedTicketId === ticket.id && (
                            <div className="ticket-comments">
                                <CommentsSection ticketId={ticket.id} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}