import { Router } from "express";
import { TicketsController } from "./tickets.controller";
import { authMiddleware, authorizeRoles } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new TicketsController();

router.post("/", authMiddleware, TicketsController.create);
router.get("/", authMiddleware, TicketsController.list);
router.patch("/:id/status", authMiddleware, authorizeRoles("AGENT", "ADMIN"), TicketsController.updateStatus);

export { router as ticketsRoutes };