import { Request, Response } from "express";
import { CommentsService } from "./comments.service";

const service = new CommentsService();

export class CommentsController {
    async create(req: Request, res: Response) {
        try {
            const { content } = req.body;
            const ticketId = req.params.ticketId as string;

            const comment = await service.create({
                content,
                ticketId,
                userId: req.user!.id,
                role: req.user!.role,
            });

            return res.status(201).json(comment);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const ticketIdStr = ticketId as string;

            const comments = await service.list(
                ticketIdStr,
                req.user!.id,
                req.user!.role
            );

            return res.json(comments);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}