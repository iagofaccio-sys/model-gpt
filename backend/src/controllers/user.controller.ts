import { Request, Response, NextFunction } from "express";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/appError";

export const userController = {
  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const users = await userRepository.findAll();

      return res.status(200).json(
        users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          baseId: user.baseId,
          supervisorId: user.supervisorId,
        }))
      );
    } catch (error) {
      next(error);
    }
  },
};