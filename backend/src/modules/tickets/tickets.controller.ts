import { Request, Response } from "express";
import { TicketsService } from "./tickets.service";
import { Prisma, TicketStatus } from "@prisma/client";

export class TicketsController {
    static async create(req: Request, res: Response) {
        try {
            const { title, description } = req.body;

            if (!title || !description) {
                return res.status(400).json({ message: "Title and description are required" });
            }

            if (!req.user?.id) {
                console.log(req.user)
                return res.status(401).json({ message: "Unauthorized" });
            }

            const ticket = await TicketsService.create({
                title,
                description,
                userId: req.user.id,
            });

            res.status(201).json(ticket);

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const status = req.query.status as TicketStatus | undefined;

            if (!req.user?.id || !req.user?.role) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const tickets = await TicketsService.list(
                req.user.id,
                req.user.role,
                status
            );

            res.json(tickets);

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateStatus(req: Request<{ id: string }>, res: Response) {
        try {
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: "Status is required" });
            }

            const ticket = await TicketsService.updateStatus(
                req.params.id,
                status as TicketStatus
            );

            res.json(ticket);

        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                res.status(404).json({ message: "Ticket not found" });
            } else {
                console.log(req.body)
                console.log(error);
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
}