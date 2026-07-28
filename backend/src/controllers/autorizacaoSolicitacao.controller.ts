import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { autorizacaoSolicitacaoService } from "../services/autorizacaoSolicitacao.service";

export const autorizacaoSolicitacaoController = {
  async listarPendentes(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const result = await autorizacaoSolicitacaoService.listarPendentesAutorizacao(
        req.user
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async autorizar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const result = await autorizacaoSolicitacaoService.autorizarSolicitacao(
        req.user,
        idParam
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async rejeitar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const result = await autorizacaoSolicitacaoService.rejeitarSolicitacao(
        req.user,
        idParam,
        req.body.observacaoOperador
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};