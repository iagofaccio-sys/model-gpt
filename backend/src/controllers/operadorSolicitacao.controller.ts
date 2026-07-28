import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { operadorSolicitacaoService } from "../services/operadorSolicitacao.service";
import { getIO } from "../socket";

export const operadorSolicitacaoController = {
  async listarPendentes(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const result = await operadorSolicitacaoService.listarPendentes(req.user);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const result = await operadorSolicitacaoService.buscarPorId(
        req.user,
        idParam
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async assumirAnalise(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const result = await operadorSolicitacaoService.assumirAnalise(
        req.user,
        idParam
      );

      getIO().to(`user:${result.solicitadoPorId}`).emit("solicitacao_em_analise", {
        id: result.id,
        status: result.status,
        atualizacao: result.atualizacao,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async editarDados(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const result = await operadorSolicitacaoService.editarDadosSolicitacao(
        req.user,
        idParam,
        req.body.dadosSolicitados,
        req.body.observacaoOperador
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async concluir(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const result = await operadorSolicitacaoService.concluirSolicitacao(
        req.user,
        idParam,
        {
          codigoCliente: req.body.codigoCliente,
          observacaoOperador: req.body.observacaoOperador,
        }
      );

      getIO().to(`user:${result.solicitadoPorId}`).emit("solicitacao_concluida", {
        id: result.id,
        status: result.status,
        atualizacao: result.atualizacao,
      });

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

      const result = await operadorSolicitacaoService.rejeitarSolicitacao(
        req.user,
        idParam,
        req.body.observacaoOperador
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async liberarAtualizacao(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const result = await operadorSolicitacaoService.liberarAtualizacao(
        req.user,
        idParam,
        req.body.observacaoOperador
      );

      getIO().to(`user:${result.solicitadoPorId}`).emit("atualizacao_disponivel", {
        id: result.id,
        status: result.status,
        atualizacao: result.atualizacao,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};