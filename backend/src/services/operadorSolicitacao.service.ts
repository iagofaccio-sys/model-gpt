import {
  Prisma,
  Role,
  TipoSolicitacaoCliente,
  StatusSolicitacaoCliente,
} from "@prisma/client";
import { AppError } from "../utils/appError";
import { solicitacaoClienteRepository } from "../repositories/solicitacaoCliente.repository";
import { clienteRepository } from "../repositories/cliente.repository";

type UsuarioAutenticado = {
  userId: string;
  role: Role;
  email: string;
};

function ensureOperador(usuario: UsuarioAutenticado) {
  if (usuario.role !== Role.OPERADOR) {
    throw new AppError("Somente OPERADOR pode executar esta ação.", 403);
  }
}

function getString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(`Campo ${fieldName} inválido na solicitação.`, 400);
  }
  return value;
}

function getNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new AppError(`Campo ${fieldName} inválido na solicitação.`, 400);
  }
  return value;
}

function getBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new AppError(`Campo ${fieldName} inválido na solicitação.`, 400);
  }
  return value;
}

export const operadorSolicitacaoService = {
  async listarPendentes(usuario: UsuarioAutenticado) {
    ensureOperador(usuario);
    return solicitacaoClienteRepository.findPendentesOperador();
  },

  async buscarPorId(usuario: UsuarioAutenticado, solicitacaoId: string) {
    ensureOperador(usuario);

    const solicitacao = await solicitacaoClienteRepository.findById(solicitacaoId);

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada.", 404);
    }

    return solicitacao;
  },

  async assumirAnalise(usuario: UsuarioAutenticado, solicitacaoId: string) {
    ensureOperador(usuario);

    const solicitacao = await solicitacaoClienteRepository.findById(solicitacaoId);

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada.", 404);
    }

    if (solicitacao.status !== StatusSolicitacaoCliente.PENDENTE) {
      throw new AppError("Somente solicitações pendentes podem ser assumidas.", 400);
    }

    return solicitacaoClienteRepository.marcarEmAnalise(
      solicitacao.id,
      usuario.userId
    );
  },

  async editarDadosSolicitacao(
    usuario: UsuarioAutenticado,
    solicitacaoId: string,
    dadosSolicitados: Record<string, unknown>,
    observacaoOperador?: string
  ) {
    ensureOperador(usuario);

    const solicitacao = await solicitacaoClienteRepository.findById(solicitacaoId);

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada.", 404);
    }

    if (
      solicitacao.status !== StatusSolicitacaoCliente.PENDENTE &&
      solicitacao.status !== StatusSolicitacaoCliente.EM_ANALISE
    ) {
      throw new AppError(
        "Somente solicitações pendentes ou em análise podem ser editadas.",
        400
      );
    }

    return solicitacaoClienteRepository.atualizarDadosSolicitados(
      solicitacao.id,
      dadosSolicitados as Prisma.InputJsonValue,
      observacaoOperador,
      usuario.userId
    );
  },

  async concluirSolicitacao(
    usuario: UsuarioAutenticado,
    solicitacaoId: string,
    payload: {
      codigoCliente?: string;
      observacaoOperador?: string;
    }
  ) {
    ensureOperador(usuario);

    const solicitacao = await solicitacaoClienteRepository.findById(solicitacaoId);

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada.", 404);
    }

    if (
      solicitacao.status !== StatusSolicitacaoCliente.PENDENTE &&
      solicitacao.status !== StatusSolicitacaoCliente.EM_ANALISE
    ) {
      throw new AppError(
        "Somente solicitações pendentes ou em análise podem ser concluídas.",
        400
      );
    }

    if (
      solicitacao.tipoSolicitacao === TipoSolicitacaoCliente.ALTERACAO_SENSIVEL &&
      !solicitacao.autorizacaoGerente
    ) {
      throw new AppError(
        "Solicitação sensível ainda não autorizada pelo gerente.",
        400
      );
    }

    const dados = solicitacao.dadosSolicitados as Record<string, unknown>;

    if (solicitacao.tipoSolicitacao === TipoSolicitacaoCliente.NOVO_CADASTRO) {
      const codigoCliente = payload.codigoCliente?.trim();

      if (!codigoCliente) {
        throw new AppError(
          "codigoCliente é obrigatório para concluir novo cadastro.",
          400
        );
      }

      const cnpj = getString(dados.cnpj, "cnpj");

      const clienteExistente = await clienteRepository.findByCnpj(cnpj);

      if (clienteExistente) {
        throw new AppError("Já existe cliente cadastrado com este CNPJ.", 409);
      }

      await clienteRepository.create({
        codigoCliente,
        cnpj,
        razaoSocial: getString(dados.razaoSocial, "razaoSocial"),
        nomeFantasia: getString(dados.nomeFantasia, "nomeFantasia"),
        subcanalId: getString(dados.subcanalId, "subcanalId"),
        rotaId: getString(dados.rotaId, "rotaId"),
        sequencia: getNumber(dados.sequencia, "sequencia"),
        diaAtendimentoId: getString(dados.diaAtendimentoId, "diaAtendimentoId"),
        horarioFuncionamento: getString(
          dados.horarioFuncionamento,
          "horarioFuncionamento"
        ),
        nomeContato: getString(dados.nomeContato, "nomeContato"),
        telefoneWhatsapp: getString(dados.telefoneWhatsapp, "telefoneWhatsapp"),
        limiteCredito: getNumber(dados.limiteCredito, "limiteCredito"),
        diasPrazo: getNumber(dados.diasPrazo, "diasPrazo"),
        bloqueioFinanceiro: getBoolean(
          dados.bloqueioFinanceiro,
          "bloqueioFinanceiro"
        ),
        fotoInternaUrl:
          typeof dados.fotoInternaUrl === "string" ? dados.fotoInternaUrl : undefined,
        fotoExternaUrl:
          typeof dados.fotoExternaUrl === "string" ? dados.fotoExternaUrl : undefined,
        vendedorId: getString(dados.vendedorId, "vendedorId"),
        baseId: getString(dados.baseId, "baseId"),
      });
    }

    if (solicitacao.tipoSolicitacao === TipoSolicitacaoCliente.ATIVACAO_INATIVACAO) {
      if (!solicitacao.clienteId) {
        throw new AppError("Solicitação sem cliente vinculado.", 400);
      }

      const cliente = await clienteRepository.findById(solicitacao.clienteId);

      if (!cliente) {
        throw new AppError("Cliente não encontrado.", 404);
      }

      const acao = getString(dados.acao, "acao");

      await clienteRepository.update(cliente.id, {
        ativo: acao === "ATIVAR",
      });
    }

    if (solicitacao.tipoSolicitacao === TipoSolicitacaoCliente.ALTERACAO_NORMAL) {
      if (!solicitacao.clienteId) {
        throw new AppError("Solicitação sem cliente vinculado.", 400);
      }

      const cliente = await clienteRepository.findById(solicitacao.clienteId);

      if (!cliente) {
        throw new AppError("Cliente não encontrado.", 404);
      }

      const updateData: Record<string, unknown> = {};

      if (typeof dados.nomeFantasia === "string") updateData.nomeFantasia = dados.nomeFantasia;
      if (typeof dados.subcanalId === "string") updateData.subcanalId = dados.subcanalId;
      if (typeof dados.rotaId === "string") updateData.rotaId = dados.rotaId;
      if (typeof dados.sequencia === "number") updateData.sequencia = dados.sequencia;
      if (typeof dados.diaAtendimentoId === "string") updateData.diaAtendimentoId = dados.diaAtendimentoId;
      if (typeof dados.horarioFuncionamento === "string") updateData.horarioFuncionamento = dados.horarioFuncionamento;
      if (typeof dados.nomeContato === "string") updateData.nomeContato = dados.nomeContato;
      if (typeof dados.telefoneWhatsapp === "string") updateData.telefoneWhatsapp = dados.telefoneWhatsapp;
      if (typeof dados.fotoInternaUrl === "string") updateData.fotoInternaUrl = dados.fotoInternaUrl;
      if (typeof dados.fotoExternaUrl === "string") updateData.fotoExternaUrl = dados.fotoExternaUrl;

      await clienteRepository.update(cliente.id, updateData);
    }

    if (solicitacao.tipoSolicitacao === TipoSolicitacaoCliente.ALTERACAO_SENSIVEL) {
      if (!solicitacao.clienteId) {
        throw new AppError("Solicitação sem cliente vinculado.", 400);
      }

      const cliente = await clienteRepository.findById(solicitacao.clienteId);

      if (!cliente) {
        throw new AppError("Cliente não encontrado.", 404);
      }

      const updateData: Record<string, unknown> = {};

      if (typeof dados.limiteCredito === "number") updateData.limiteCredito = dados.limiteCredito;
      if (typeof dados.diasPrazo === "number") updateData.diasPrazo = dados.diasPrazo;
      if (typeof dados.bloqueioFinanceiro === "boolean") {
        updateData.bloqueioFinanceiro = dados.bloqueioFinanceiro;
      }

      await clienteRepository.update(cliente.id, updateData);
    }

    return solicitacaoClienteRepository.concluir(
      solicitacao.id,
      usuario.userId,
      payload.observacaoOperador
    );
  },

  async rejeitarSolicitacao(
    usuario: UsuarioAutenticado,
    solicitacaoId: string,
    observacaoOperador: string
  ) {
    ensureOperador(usuario);

    const solicitacao = await solicitacaoClienteRepository.findById(solicitacaoId);

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada.", 404);
    }

    if (
      solicitacao.status !== StatusSolicitacaoCliente.PENDENTE &&
      solicitacao.status !== StatusSolicitacaoCliente.EM_ANALISE
    ) {
      throw new AppError(
        "Somente solicitações pendentes ou em análise podem ser rejeitadas.",
        400
      );
    }

    return solicitacaoClienteRepository.rejeitar(
      solicitacao.id,
      observacaoOperador,
      usuario.userId
    );
  },

  async liberarAtualizacao(
    usuario: UsuarioAutenticado,
    solicitacaoId: string,
    observacaoOperador?: string
  ) {
    ensureOperador(usuario);

    const solicitacao = await solicitacaoClienteRepository.findById(solicitacaoId);

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada.", 404);
    }

    if (solicitacao.status !== StatusSolicitacaoCliente.CONCLUIDO) {
      throw new AppError(
        "Somente solicitações concluídas podem liberar atualização.",
        400
      );
    }

    if (solicitacao.atualizacao) {
      throw new AppError("Atualização já liberada para esta solicitação.", 400);
    }

    return solicitacaoClienteRepository.marcarAtualizacaoComoDisponivel(
      solicitacao.id,
      usuario.userId,
      observacaoOperador
    );
  },
};