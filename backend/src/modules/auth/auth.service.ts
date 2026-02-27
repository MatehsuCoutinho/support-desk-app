import { prisma } from "../../database/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export class AuthService {
    static async register(name: string, email: string, password: string, role: "USER" | "ADMIN" | "AGENT" = "USER") {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role: role },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        return user;
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "7d",
        });

        const { password: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }
}