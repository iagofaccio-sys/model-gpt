import { z } from "zod";

export const rejeitarSolicitacaoSchema = z.object({
  observacaoOperador: z.string().min(1, "Observação é obrigatória."),
});