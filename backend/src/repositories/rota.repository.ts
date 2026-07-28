import { prisma } from "../lib/prisma";

export const rotaRepository = {
  findAll() {
    return prisma.rota.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });
  },
};