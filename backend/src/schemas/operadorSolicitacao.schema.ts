import { z } from "zod";

export const concluirSolicitacaoSchema = z.object({
  codigoCliente: z.string().optional(),
  observacaoOperador: z.string().optional(),
});

export const rejeitarSolicitacaoOperadorSchema = z.object({
  observacaoOperador: z.string().min(1, "Observação é obrigatória."),
});

export const editarDadosSolicitacaoSchema = z.object({
  dadosSolicitados: z.record(z.string(), z.unknown()),
  observacaoOperador: z.string().optional(),
});

export const liberarAtualizacaoSchema = z.object({
  observacaoOperador: z.string().optional(),
});