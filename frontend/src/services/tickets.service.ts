import { api } from "./api";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
  createdAt: string;
}

export async function getTickets() {
  const response = await api.get("/tickets");
  return response.data;
}

export async function createTicket(data: {
  title: string;
  description: string;
}) {
  const response = await api.post("/tickets", data);
  return response.data;
}