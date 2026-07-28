import { z } from "zod";

export const createSalesCoverageSchema = z.object({
  substituteId: z.string().min(1, "substituteId é obrigatório."),
  coveredUserId: z.string().min(1, "coveredUserId é obrigatório."),
  startDate: z.string().min(1, "startDate é obrigatório."),
  endDate: z.string().min(1, "endDate é obrigatório."),
});