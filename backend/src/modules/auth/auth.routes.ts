import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware, authorizeAdmin } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", authMiddleware, authorizeAdmin, AuthController.register);
router.post("/login", AuthController.login);

export default router;