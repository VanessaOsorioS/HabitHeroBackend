import { Request, Response, NextFunction } from "express";
import { findToken, findUserById } from "./middleware.service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Rutas públicas que NO deben pedir token
        const publicRoutes = [
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh"
        ];

        // Si la ruta está en las públicas → pasa directo
        if (publicRoutes.includes(req.path)) {
            return next();
        }

        // Si la ruta inicia con /api/auth → también es pública
        if (req.path.startsWith("/api/auth")) {
            return next();
        }

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
