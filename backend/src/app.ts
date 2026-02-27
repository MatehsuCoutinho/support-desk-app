import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import { ticketsRoutes } from "./modules/tickets/tickets.routes";
import { commentsRoutes } from "./modules/comments/comments.routes";


export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    return res.json({ message: "Support Desk API running" });
});
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/comments", commentsRoutes);