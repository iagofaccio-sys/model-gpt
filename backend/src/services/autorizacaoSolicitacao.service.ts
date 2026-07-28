import { Role, TipoSolicitacaoCliente, StatusSolicitacaoCliente } from "@prisma/client";
import { AppError } from "../utils/appError";
import { solicitacaoClienteRepository } from "../repositories/solicitacaoCliente.repository";

type UsuarioAutenticado = {
  userId: string;
  role: Role;
  email: string;
};

export const autorizacaoSolicitacaoService = {
  async listarPendentesAutorizacao(usuario: UsuarioAutenticado) {
    if (usuario.role !== Role.GERENTE) {
      throw new AppError("Somente GERENTE pode visualizar pendências de autorização.", 403);
    }

    return solicitacaoClienteRepository.findPendentesAutorizacaoSensivel();
  },

  async autorizarSolicitacao(usuario: UsuarioAutenticado, solicitacaoId: string) {
    if (usuario.role !== Role.GERENTE) {
      throw new AppError("Somente GERENTE pode autorizar solicitação sensível.", 403);
    }

    const solicitacao = await solicitacaoClienteRepository.findById(solicitacaoId);

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada.", 404);
    }

    if (solicitacao.tipoSolicitacao !== TipoSolicitacaoCliente.ALTERACAO_SENSIVEL) {
      throw new AppError("Somente solicitações sensíveis podem ser autorizadas pelo gerente.", 400);
    }

    if (solicitacao.status !== StatusSolicitacaoCliente.PENDENTE) {
      throw new AppError("Somente solicitações pendentes podem ser autorizadas.", 400);
    }

    if (solicitacao.autorizacaoGerente) {
      throw new AppError("Solicitação já autorizada pelo gerente.", 400);
    }

    return solicitacaoClienteRepository.autorizarPorGerente(
      solicitacao.id,
      usuario.userId
    );
  },

  async rejeitarSolicitacao(
    usuario: UsuarioAutenticado,
    solicitacaoId: string,
    observacaoOperador: string
  ) {
    if (usuario.role !== Role.GERENTE) {
      throw new AppError("Somente GERENTE pode rejeitar solicitação sensível nesta etapa.", 403);
    }

    const solicitacao = await solicitacaoClienteRepository.findById(solicitacaoId);

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada.", 404);
    }

    if (solicitacao.tipoSolicitacao !== TipoSolicitacaoCliente.ALTERACAO_SENSIVEL) {
      throw new AppError("Somente solicitações sensíveis podem ser rejeitadas pelo gerente nesta etapa.", 400);
    }

    if (solicitacao.status !== StatusSolicitacaoCliente.PENDENTE) {
      throw new AppError("Somente solicitações pendentes podem ser rejeitadas.", 400);
    }

    return solicitacaoClienteRepository.rejeitar(
      solicitacao.id,
      observacaoOperador
    );
  },
};