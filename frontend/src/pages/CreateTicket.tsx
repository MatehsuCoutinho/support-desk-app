import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../services/tickets.service";

export default function CreateTicket() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await createTicket({ title, description });
            navigate("/tickets");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Novo Ticket</h1>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <input
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Criando..." : "Criar"}
                </button>
            </form>
        </div>
    );
}