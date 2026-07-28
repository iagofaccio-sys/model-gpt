import { prisma } from "../lib/prisma";

type CriarClienteData = {
  codigoCliente?: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  subcanalId: string;
  rotaId: string;
  sequencia: number;
  diaAtendimentoId: string;
  horarioFuncionamento: string;
  nomeContato: string;
  telefoneWhatsapp: string;
  limiteCredito: number;
  diasPrazo: number;
  bloqueioFinanceiro: boolean;
  fotoInternaUrl?: string;
  fotoExternaUrl?: string;
  vendedorId: string;
  baseId: string;
};

type AtualizarClienteData = Partial<CriarClienteData> & {
  ativo?: boolean;
};

export const clienteRepository = {
  findAll() {
    return prisma.cliente.findMany({
      include: {
        subcanal: true,
        rota: true,
        diaAtendimento: true,
        vendedor: true,
      },
      orderBy: {
        razaoSocial: "asc",
      },
    });
  },

  findById(id: string) {
    return prisma.cliente.findUnique({
      where: { id },
      include: {
        subcanal: true,
        rota: true,
        diaAtendimento: true,
        vendedor: true,
      },
    });
  },

  findByCnpj(cnpj: string) {
    return prisma.cliente.findUnique({
      where: { cnpj },
      include: {
        subcanal: true,
        rota: true,
        diaAtendimento: true,
        vendedor: true,
      },
    });
  },

  create(data: CriarClienteData) {
    return prisma.cliente.create({
      data,
      include: {
        subcanal: true,
        rota: true,
        diaAtendimento: true,
        vendedor: true,
      },
    });
  },

  update(id: string, data: AtualizarClienteData) {
    return prisma.cliente.update({
      where: { id },
      data,
      include: {
        subcanal: true,
        rota: true,
        diaAtendimento: true,
        vendedor: true,
      },
    });
  },
};