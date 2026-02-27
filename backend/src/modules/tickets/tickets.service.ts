import { prisma } from "../../database/prisma";
import { TicketStatus, Role, Prisma } from "@prisma/client";

interface CreateTicketDTO {
    title: string;
    description: string;
    userId: string;
}

export class TicketsService {
    static async create({ title, description, userId }: CreateTicketDTO) {
        return prisma.ticket.create({
            data: {
                title,
                description,
                user: {
                    connect: { id: userId }
                }
            },
            include: {
                user: true
            }
        });
    }

    static async list(
        userId: string,
        role: Role,
        status?: TicketStatus
    ) {
        const where: Prisma.TicketWhereInput = {};

        if (role === "USER") {
            where.userId = userId;
        }

        if (status) {
            where.status = status;
        }

        return prisma.ticket.findMany({
            where,
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }

    static async updateStatus(id: string, status: TicketStatus) {
        return prisma.ticket.update({
            where: { id },
            data: { status }
        });
    }
}