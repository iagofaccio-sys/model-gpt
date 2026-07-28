import {
  Prisma,
  TipoSolicitacaoCliente,
  StatusSolicitacaoCliente,
  Role,
} from "@prisma/client";
import { prisma } from "../lib/prisma";

export type CriarSolicitacaoClienteData = {
  tipoSolicitacao: TipoSolicitacaoCliente;
  status?: StatusSolicitacaoCliente;
  clienteId?: string;
  solicitadoPorId: string;
  solicitadoPorPerfil: Role;
  operadorResponsavelId?: string;
  autorizadoPorGerenteId?: string;
  autorizacaoGerente?: boolean;
  acaoAtivacao?: "ATIVAR" | "INATIVAR";
  motivo?: string;
  observacaoSolicitacao?: string;
  observacaoOperador?: string;
  dadosSolicitados: Prisma.InputJsonValue;
  concluidoEm?: Date;
};

export const solicitacaoClienteRepository = {
  create(data: CriarSolicitacaoClienteData) {
    return prisma.solicitacaoCliente.create({
      data: {
        tipoSolicitacao: data.tipoSolicitacao,
        status: data.status,
        clienteId: data.clienteId,
        solicitadoPorId: data.solicitadoPorId,
        solicitadoPorPerfil: data.solicitadoPorPerfil,
        operadorResponsavelId: data.operadorResponsavelId,
        autorizadoPorGerenteId: data.autorizadoPorGerenteId,
        autorizacaoGerente: data.autorizacaoGerente,
        acaoAtivacao: data.acaoAtivacao,
        motivo: data.motivo,
        observacaoSolicitacao: data.observacaoSolicitacao,
        observacaoOperador: data.observacaoOperador,
        dadosSolicitados: data.dadosSolicitados,
        concluidoEm: data.concluidoEm,
      },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
    });
  },

  findAll() {
    return prisma.solicitacaoCliente.findMany({
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });
  },

  findById(id: string) {
    return prisma.solicitacaoCliente.findUnique({
      where: { id },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
    });
  },

  findPendentesAutorizacaoSensivel() {
    return prisma.solicitacaoCliente.findMany({
      where: {
        tipoSolicitacao: TipoSolicitacaoCliente.ALTERACAO_SENSIVEL,
        autorizacaoGerente: false,
        status: StatusSolicitacaoCliente.PENDENTE,
      },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });
  },

  findPendentesOperador() {
    return prisma.solicitacaoCliente.findMany({
      where: {
        status: StatusSolicitacaoCliente.PENDENTE,
      },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });
  },

  autorizarPorGerente(id: string, gerenteId: string) {
    return prisma.solicitacaoCliente.update({
      where: { id },
      data: {
        autorizacaoGerente: true,
        autorizadoPorGerenteId: gerenteId,
      },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
    });
  },

  marcarEmAnalise(id: string, operadorId: string) {
    return prisma.solicitacaoCliente.update({
      where: { id },
      data: {
        status: StatusSolicitacaoCliente.EM_ANALISE,
        operadorResponsavelId: operadorId,
      },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
    });
  },

  atualizarDadosSolicitados(
    id: string,
    dadosSolicitados: Prisma.InputJsonValue,
    observacaoOperador?: string,
    operadorResponsavelId?: string
  ) {
    return prisma.solicitacaoCliente.update({
      where: { id },
      data: {
        dadosSolicitados,
        observacaoOperador,
        operadorResponsavelId,
      },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
    });
  },

  concluir(id: string, operadorId: string, observacaoOperador?: string) {
    return prisma.solicitacaoCliente.update({
      where: { id },
      data: {
        status: StatusSolicitacaoCliente.CONCLUIDO,
        operadorResponsavelId: operadorId,
        observacaoOperador,
        concluidoEm: new Date(),
      },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
    });
  },

  rejeitar(id: string, observacaoOperador?: string, operadorId?: string) {
    return prisma.solicitacaoCliente.update({
      where: { id },
      data: {
        status: StatusSolicitacaoCliente.REJEITADO,
        observacaoOperador,
        operadorResponsavelId: operadorId,
      },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
    });
  },

  marcarAtualizacaoComoDisponivel(
    id: string,
    operadorId: string,
    observacaoOperador?: string
  ) {
    return prisma.solicitacaoCliente.update({
      where: { id },
      data: {
        atualizacao: true,
        operadorResponsavelId: operadorId,
        observacaoOperador,
      },
      include: {
        cliente: true,
        solicitadoPor: true,
        operadorResponsavel: true,
        autorizadoPorGerente: true,
      },
    });
  },
};