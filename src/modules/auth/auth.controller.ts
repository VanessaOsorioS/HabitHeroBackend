import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await authService.validateUser(email, password);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = await authService.createToken(user.id);

    return res.status(200).json({
      message: "Login successful",
      token: token.tokenString,
      expiresAt: token.expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  }
}
