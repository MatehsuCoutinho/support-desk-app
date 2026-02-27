import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { AuthService } from "../auth/auth.service";

export class UsersController {
    static async create(req: AuthRequest, res: Response) {
        try {
            if (req.user.role !== "ADMIN") {
                return res.status(403).json({ error: "Only admin can create users" });
            }
            const { name, email, password, role } = req.body;
                        if (!name || !email || !password) {
                return res.status(400).json({ error: "Name, email and password are required" });
            }
            const validRoles = ["USER", "ADMIN", "AGENT"];
            
            if (role) {
                if (typeof role !== 'string') {
                    return res.status(400).json({ error: "Role must be a string" });
                }
                
                if (!validRoles.includes(role)) {
                    return res.status(400).json({ 
                        error: `Invalid role. Must be one of: ${validRoles.join(", ")}` 
                    });
                }
            } else {
                return res.status(400).json({ error: "Role is required" });
            }

            const user = await AuthService.register(
                name,
                email,
                password,
                role as "ADMIN" | "USER" | "AGENT"
            );

            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}