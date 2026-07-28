import { z } from "zod";

export const solicitarAtivacaoInativacaoSchema = z.object({
  clienteId: z.string().min(1, "clienteId é obrigatório."),
  acao: z.enum(["ATIVAR", "INATIVAR"]),
  motivo: z.string().min(1, "Motivo é obrigatório."),
  observacaoSolicitacao: z.string().optional(),
});

export const solicitarNovoCadastroSchema = z.object({
  cnpj: z.string().min(1, "CNPJ é obrigatório."),
  razaoSocial: z.string().min(1, "Razão Social é obrigatória."),
  nomeFantasia: z.string().min(1, "Nome fantasia é obrigatório."),
  subcanalId: z.string().min(1, "subcanalId é obrigatório."),
  rotaId: z.string().min(1, "rotaId é obrigatório."),
  sequencia: z.number().int("Sequência deve ser um número inteiro."),
  diaAtendimentoId: z.string().min(1, "diaAtendimentoId é obrigatório."),
  horarioFuncionamento: z.string().min(1, "Horário de funcionamento é obrigatório."),
  nomeContato: z.string().min(1, "Nome do contato é obrigatório."),
  telefoneWhatsapp: z.string().min(1, "Telefone WhatsApp é obrigatório."),
  limiteCredito: z.number(),
  diasPrazo: z.number().int("Dias prazo deve ser inteiro."),
  bloqueioFinanceiro: z.boolean(),
  fotoInternaUrl: z.string().optional(),
  fotoExternaUrl: z.string().optional(),
  vendedorId: z.string().min(1, "vendedorId é obrigatório."),
  baseId: z.string().min(1, "baseId é obrigatório."),
  observacaoSolicitacao: z.string().optional(),
});

export const solicitarAlteracaoSensivelSchema = z.object({
  clienteId: z.string().min(1, "clienteId é obrigatório."),
  limiteCredito: z.number().optional(),
  diasPrazo: z.number().int().optional(),
  bloqueioFinanceiro: z.boolean().optional(),
  motivo: z.string().min(1, "Motivo é obrigatório."),
  observacaoSolicitacao: z.string().optional(),
});

export const solicitarAlteracaoNormalSchema = z.object({
  clienteId: z.string().min(1, "clienteId é obrigatório."),
  nomeFantasia: z.string().optional(),
  subcanalId: z.string().optional(),
  rotaId: z.string().optional(),
  sequencia: z.number().int().optional(),
  diaAtendimentoId: z.string().optional(),
  horarioFuncionamento: z.string().optional(),
  nomeContato: z.string().optional(),
  telefoneWhatsapp: z.string().optional(),
  fotoInternaUrl: z.string().optional(),
  fotoExternaUrl: z.string().optional(),
  observacaoSolicitacao: z.string().optional(),
});