import { useEffect, useState } from "react";
import { getComments, createComment } from "./commentsService";
import "./comments.css";

interface CommentsSectionProps {
  ticketId: string;
}

export default function CommentsSection({ ticketId }: CommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function loadComments() {
    try {
      const data = await getComments(ticketId);
      console.log("COMMENTS RESPONSE:", data);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      await createComment(ticketId, content);
      setContent("");
      await loadComments();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [ticketId]);

  return (
    <div className="comments-container">
      <h3>Comentários {comments.length > 0 && `(${comments.length})`}</h3>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="comments-empty">Nenhum comentário ainda.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <strong>{comment.user.name}</strong>
                <span className={`role ${comment.user.role.toLowerCase()}`}>
                  {comment.user.role}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          placeholder="Escreva um comentário..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Comentar"}
        </button>
      </form>
    </div>
  );
}