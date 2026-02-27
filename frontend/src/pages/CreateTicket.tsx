import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTicket } from "../services/tickets.service";
import "./CreateTicket.css";

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
        <div className="create-ticket-page">
            <p className="create-ticket-eyebrow">Novo Registro</p>
            <h1 className="create-ticket-title">Novo Ticket</h1>

            <form className="create-ticket-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label className="form-label">Título</label>
                    <input
                        className="form-input"
                        placeholder="Ex: Bug na tela de login"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">Descrição</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Descreva o problema ou solicitação..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-footer">
                    <Link to="/tickets" className="btn-cancel">Cancelar</Link>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Criando..." : "Criar Ticket"}
                    </button>
                </div>
            </form>
        </div>
    );
}