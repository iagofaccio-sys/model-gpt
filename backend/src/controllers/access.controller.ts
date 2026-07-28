import { Request, Response, NextFunction } from "express";
import { accessService } from "../services/access.service";
import { AppError } from "../utils/appError";

export const accessController = {
  async checkUserAccess(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const result = await accessService.canAccessUser(req.user, idParam);

      return res.status(200).json({
        currentUser: req.user,
        allowed: result.allowed,
        reason: result.reason,
        targetUser: {
          id: result.targetUser.id,
          name: result.targetUser.name,
          email: result.targetUser.email,
          role: result.targetUser.role,
          baseId: result.targetUser.baseId,
          supervisorId: result.targetUser.supervisorId,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};