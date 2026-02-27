import { api } from "../services/api";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export async function getComments(ticketId: string): Promise<Comment[]> {
  const response = await api.get(`/comments/${ticketId}`);
  return response.data;
}

export async function createComment(
  ticketId: string,
  content: string
): Promise<Comment> {
  const response = await api.post(`/comments/${ticketId}`, {
    content,
  });

  return response.data;
}