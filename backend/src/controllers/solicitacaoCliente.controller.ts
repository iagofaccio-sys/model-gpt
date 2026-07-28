import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { solicitacaoClienteService } from "../services/solicitacaoCliente.service";
import { getIO } from "../socket";

export const solicitacaoClienteController = {
  async solicitarAtivacaoInativacao(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const result =
        await solicitacaoClienteService.solicitarAtivacaoInativacao(
          req.user,
          req.body
        );

      getIO().to("role:OPERADOR").emit("nova_solicitacao", {
        id: result.id,
        tipoSolicitacao: result.tipoSolicitacao,
        status: result.status,
        atualizacao: result.atualizacao,
        solicitadoPor: result.solicitadoPor?.name,
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async solicitarNovoCadastro(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const result = await solicitacaoClienteService.solicitarNovoCadastro(
        req.user,
        req.body
      );

      getIO().to("role:OPERADOR").emit("nova_solicitacao", {
        id: result.id,
        tipoSolicitacao: result.tipoSolicitacao,
        status: result.status,
        atualizacao: result.atualizacao,
        solicitadoPor: result.solicitadoPor?.name,
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async solicitarAlteracaoSensivel(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const result =
        await solicitacaoClienteService.solicitarAlteracaoSensivel(
          req.user,
          req.body
        );

      getIO().to("role:OPERADOR").emit("nova_solicitacao", {
        id: result.id,
        tipoSolicitacao: result.tipoSolicitacao,
        status: result.status,
        atualizacao: result.atualizacao,
        solicitadoPor: result.solicitadoPor?.name,
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async solicitarAlteracaoNormal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const result = await solicitacaoClienteService.solicitarAlteracaoNormal(
        req.user,
        req.body
      );

      getIO().to("role:OPERADOR").emit("nova_solicitacao", {
        id: result.id,
        tipoSolicitacao: result.tipoSolicitacao,
        status: result.status,
        atualizacao: result.atualizacao,
        solicitadoPor: result.solicitadoPor?.name,
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async listarSolicitacoes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const result = await solicitacaoClienteService.listarSolicitacoes();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async buscarSolicitacaoPorId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new AppError("Não autenticado.", 401);
      }

      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const result = await solicitacaoClienteService.buscarSolicitacaoPorId(
        idParam
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};