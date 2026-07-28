import { prisma } from "../lib/prisma";

export const subcanalRepository = {
  findAll() {
    return prisma.subcanal.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });
  },
};