import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { prisma } from "../../database/prisma";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const user = await AuthService.register(name, email, password);

      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const data = await AuthService.login(email, password);

      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}