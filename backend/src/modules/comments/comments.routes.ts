import { Router } from "express";
import { CommentsController } from "./comments.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new CommentsController();

router.post("/:ticketId", authMiddleware, controller.create);
router.get("/:ticketId", authMiddleware, controller.list);

export { router as commentsRoutes };