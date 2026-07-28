import { prisma } from "../lib/prisma";

export const diaAtendimentoRepository = {
  findAll() {
    return prisma.diaAtendimento.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });
  },
};