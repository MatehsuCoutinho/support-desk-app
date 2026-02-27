import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware, authorizeRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", authMiddleware, authorizeRoles("ADMIN"), AuthController.register);
router.post("/login", AuthController.login);

export default router;