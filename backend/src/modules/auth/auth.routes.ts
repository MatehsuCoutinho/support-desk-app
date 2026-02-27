import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware, authorizeRoles } from "../../middlewares/auth.middleware";
import rateLimit from "express-rate-limit";

const router = Router();
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many requests, try again later",
});


router.post("/register", authLimiter, authMiddleware, authorizeRoles("ADMIN"), AuthController.register);
router.post("/login", authLimiter, AuthController.login);

export default router;