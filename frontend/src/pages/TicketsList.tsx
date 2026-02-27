import { useEffect, useState } from "react";
import { getTickets, type Ticket } from "../services/tickets.service";
import { Link } from "react-router-dom";
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
                        <span className={`status ${ticket.status}`}>
                            {ticket.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}