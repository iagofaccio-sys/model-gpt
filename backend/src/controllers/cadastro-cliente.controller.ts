import { Request, Response, NextFunction } from "express";
import { cadastroClienteService } from "../services/cadastro-cliente.service";
import { AppError } from "../utils/appError";

export const cadastroClienteController = {
  async listarSubcanais(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cadastroClienteService.listarSubcanais();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async listarRotas(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cadastroClienteService.listarRotas();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async listarDiasAtendimento(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cadastroClienteService.listarDiasAtendimento();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async listarClientes(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cadastroClienteService.listarClientes();

      return res.status(200).json(
        result.map((cliente) => ({
          id: cliente.id,
          codigoCliente: cliente.codigoCliente,
          cnpj: cliente.cnpj,
          razaoSocial: cliente.razaoSocial,
          nomeFantasia: cliente.nomeFantasia,
          subcanal: {
            id: cliente.subcanal.id,
            nome: cliente.subcanal.nome,
          },
          rota: {
            id: cliente.rota.id,
            nome: cliente.rota.nome,
          },
          sequencia: cliente.sequencia,
          diaAtendimento: {
            id: cliente.diaAtendimento.id,
            nome: cliente.diaAtendimento.nome,
          },
          horarioFuncionamento: cliente.horarioFuncionamento,
          nomeContato: cliente.nomeContato,
          telefoneWhatsapp: cliente.telefoneWhatsapp,
          limiteCredito: cliente.limiteCredito,
          diasPrazo: cliente.diasPrazo,
          bloqueioFinanceiro: cliente.bloqueioFinanceiro,
          fotoInternaUrl: cliente.fotoInternaUrl,
          fotoExternaUrl: cliente.fotoExternaUrl,
          vendedor: {
            id: cliente.vendedor.id,
            name: cliente.vendedor.name,
          },
          baseId: cliente.baseId,
          ativo: cliente.ativo,
        }))
      );
    } catch (error) {
      next(error);
    }
  },

  async buscarClientePorId(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("Parâmetro id inválido.", 400);
      }

      const cliente = await cadastroClienteService.buscarClientePorId(idParam);

      return res.status(200).json({
        id: cliente.id,
        codigoCliente: cliente.codigoCliente,
        cnpj: cliente.cnpj,
        razaoSocial: cliente.razaoSocial,
        nomeFantasia: cliente.nomeFantasia,
        subcanal: {
          id: cliente.subcanal.id,
          nome: cliente.subcanal.nome,
        },
        rota: {
          id: cliente.rota.id,
          nome: cliente.rota.nome,
        },
        sequencia: cliente.sequencia,
        diaAtendimento: {
          id: cliente.diaAtendimento.id,
          nome: cliente.diaAtendimento.nome,
        },
        horarioFuncionamento: cliente.horarioFuncionamento,
        nomeContato: cliente.nomeContato,
        telefoneWhatsapp: cliente.telefoneWhatsapp,
        limiteCredito: cliente.limiteCredito,
        diasPrazo: cliente.diasPrazo,
        bloqueioFinanceiro: cliente.bloqueioFinanceiro,
        fotoInternaUrl: cliente.fotoInternaUrl,
        fotoExternaUrl: cliente.fotoExternaUrl,
        vendedor: {
          id: cliente.vendedor.id,
          name: cliente.vendedor.name,
        },
        baseId: cliente.baseId,
        ativo: cliente.ativo,
      });
    } catch (error) {
      next(error);
    }
  },
};