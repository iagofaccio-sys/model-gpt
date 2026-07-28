import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details ?? null,
    });
  }

  return res.status(400).json({
    error: error.message || "Erro na requisição.",
  });
}