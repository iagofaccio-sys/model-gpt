import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const subcanais = [
    "Varejo Tradicional",
    "Bar",
    "Restaurante",
    "Padaria",
    "Conveniência",
    "Atacado",
  ];

  const rotas = [
    "Rota 01",
    "Rota 02",
    "Rota 03",
    "Rota Centro",
    "Rota Norte",
    "Rota Sul",
  ];

  const diasAtendimento = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  for (const nome of subcanais) {
    await prisma.subcanal.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  for (const nome of rotas) {
    await prisma.rota.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  for (const nome of diasAtendimento) {
    await prisma.diaAtendimento.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  console.log("Listas iniciais criadas com sucesso.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });