import { prisma } from "../../database/prisma";
import { Role } from "@prisma/client";

interface CreateCommentDTO {
    content: string;
    ticketId: string;
    userId: string;
    role: Role;
}

export class CommentsService {
    async create({ content, ticketId, userId, role }: CreateCommentDTO) {
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        if (role === "USER" && ticket.userId !== userId) {
            throw new Error("You cannot comment on this ticket");
        }

        return prisma.comment.create({
            data: {
                content,
                ticketId,
                userId,
            },
        });
    }

    async list(ticketId: string, userId: string, role: Role) {
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        if (role === "USER" && ticket.userId !== userId) {
            throw new Error("You cannot view comments of this ticket");
        }

        return prisma.comment.findMany({
            where: { ticketId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }
}