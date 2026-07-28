import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/appError";

export function ensureAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Token não enviado.", 401));
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return next(new AppError("Token mal formatado.", 401));
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Token mal formatado.", 401));
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.sub,
      role: payload.role as Role,
      email: payload.email,
    };

    return next();
  } catch {
    return next(new AppError("Token inválido ou expirado.", 401));
  }
}