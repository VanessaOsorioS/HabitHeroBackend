import { Request, Response, NextFunction } from "express";
import { findToken, findUserById } from "./middleware.service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const [scheme, token] = header.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({ message: "Invalid authorization format" });
        }

        const storedToken = await findToken(token);

        if (!storedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // verificar si ya expiró
        if (new Date() > new Date(storedToken.expiresAt)) {
            return res.status(401).json({ message: "Token expired" });
        }

        const user = await findUserById(storedToken.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        (req as any).userId = user.id;

        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
