import { Request, Response, NextFunction } from "express";
import { salesCoverageService } from "../services/salesCoverage.service";
import { AppError } from "../utils/appError";

export const salesCoverageController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await salesCoverageService.create(req.body);

      return res.status(201).json({
        id: result.id,
        substitute: {
          id: result.substitute.id,
          name: result.substitute.name,
          role: result.substitute.role,
          baseId: result.substitute.baseId,
        },
        coveredUser: {
          id: result.coveredUser.id,
          name: result.coveredUser.name,
          role: result.coveredUser.role,
          baseId: result.coveredUser.baseId,
        },
        startDate: result.startDate,
        endDate: result.endDate,
        isActive: result.isActive,
      });
    } catch (error) {
      next(error);
    }
  },

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await salesCoverageService.list();

      return res.status(200).json(
        result.map((coverage: any) => ({
          id: coverage.id,
          substitute: {
            id: coverage.substitute.id,
            name: coverage.substitute.name,
            role: coverage.substitute.role,
            baseId: coverage.substitute.baseId,
          },
          coveredUser: {
            id: coverage.coveredUser.id,
            name: coverage.coveredUser.name,
            role: coverage.coveredUser.role,
            baseId: coverage.coveredUser.baseId,
          },
          startDate: coverage.startDate,
          endDate: coverage.endDate,
          isActive: coverage.isActive,
        }))
      );
    } catch (error) {
      next(error);
    }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      await salesCoverageService.deactivate(idParam);

      return res.status(200).json({
        message: "Cobertura desativada com sucesso.",
      });
    } catch (error) {
      next(error);
    }
  },
};