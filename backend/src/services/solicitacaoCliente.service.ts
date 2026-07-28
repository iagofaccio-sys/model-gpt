import {
  Role,
  TipoSolicitacaoCliente,
  StatusSolicitacaoCliente,
} from "@prisma/client";
import { AppError } from "../utils/appError";
import { solicitacaoClienteRepository } from "../repositories/solicitacaoCliente.repository";
import { clienteRepository } from "../repositories/cliente.repository";
import { userRepository } from "../repositories/user.repository";
import { limparCnpj, validarCnpj } from "../utils/cnpj";

type UsuarioAutenticado = {
  userId: string;
  role: Role;
  email: string;
};

type SolicitarAtivacaoInativacaoInput = {
  clienteId: string;
  acao: "ATIVAR" | "INATIVAR";
  motivo: string;
  observacaoSolicitacao?: string;
};

type SolicitarNovoCadastroInput = {
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
  observacaoSolicitacao?: string;
};

type SolicitarAlteracaoSensivelInput = {
  clienteId: string;
  limiteCredito?: number;
  diasPrazo?: number;
  bloqueioFinanceiro?: boolean;
  motivo: string;
  observacaoSolicitacao?: string;
};

type SolicitarAlteracaoNormalInput = {
  clienteId: string;
  nomeFantasia?: string;
  subcanalId?: string;
  rotaId?: string;
  sequencia?: number;
  diaAtendimentoId?: string;
  horarioFuncionamento?: string;
  nomeContato?: string;
  telefoneWhatsapp?: string;
  fotoInternaUrl?: string;
  fotoExternaUrl?: string;
  observacaoSolicitacao?: string;
};

function podeSolicitar(usuario: UsuarioAutenticado) {
  return (
    usuario.role === Role.VENDEDOR ||
    usuario.role === Role.SUPERVISOR ||
    usuario.role === Role.GERENTE
  );
}

export const solicitacaoClienteService = {
  async solicitarAtivacaoInativacao(
    usuario: UsuarioAutenticado,
    data: SolicitarAtivacaoInativacaoInput
  ) {
    if (!podeSolicitar(usuario)) {
      throw new AppError("Perfil sem permissão para solicitar.", 403);
    }

    const cliente = await clienteRepository.findById(data.clienteId);

    if (!cliente) {
      throw new AppError("Cliente não encontrado.", 404);
    }

    return solicitacaoClienteRepository.create({
      tipoSolicitacao: TipoSolicitacaoCliente.ATIVACAO_INATIVACAO,
      status: StatusSolicitacaoCliente.PENDENTE,
      clienteId: cliente.id,
      solicitadoPorId: usuario.userId,
      solicitadoPorPerfil: usuario.role,
      acaoAtivacao: data.acao,
      motivo: data.motivo,
      observacaoSolicitacao: data.observacaoSolicitacao,
      autorizacaoGerente: usuario.role === Role.GERENTE,
      autorizadoPorGerenteId:
        usuario.role === Role.GERENTE ? usuario.userId : undefined,
      dadosSolicitados: {
        clienteId: cliente.id,
        acao: data.acao,
        motivo: data.motivo,
      },
    });
  },

async solicitarNovoCadastro(
  usuario: UsuarioAutenticado,
  data: SolicitarNovoCadastroInput
) {
  if (!podeSolicitar(usuario)) {
    throw new AppError("Perfil sem permissão para solicitar.", 403);
  }

  const vendedor = await userRepository.findById(data.vendedorId);

  if (!vendedor) {
    throw new AppError("Vendedor informado não encontrado.", 404);
  }

  if (vendedor.role !== Role.VENDEDOR) {
    throw new AppError("vendedorId deve pertencer a um usuário VENDEDOR.", 400);
  }

  if (usuario.role === Role.VENDEDOR) {
    const usuarioCompleto = await userRepository.findById(usuario.userId);

    if (!usuarioCompleto) {
      throw new AppError("Usuário autenticado não encontrado.", 404);
    }

    if (usuarioCompleto.baseId !== data.baseId) {
      throw new AppError(
        "VENDEDOR só pode solicitar novo cadastro para a própria base.",
        403
      );
    }
  }

  const cnpjLimpo = limparCnpj(data.cnpj);

  if (!validarCnpj(cnpjLimpo)) {
    throw new AppError("CNPJ inválido.", 400);
  }

  const clienteExistente = await clienteRepository.findByCnpj(cnpjLimpo);

  if (clienteExistente) {
    throw new AppError("CNPJ já cadastrado.", 409, {
      cnpj: clienteExistente.cnpj,
      razaoSocial: clienteExistente.razaoSocial,
      statusCliente: clienteExistente.ativo ? "ATIVO" : "INATIVO",
      vendedor: clienteExistente.vendedor.name,
      base: clienteExistente.baseId,
    });
  }

  return solicitacaoClienteRepository.create({
    tipoSolicitacao: TipoSolicitacaoCliente.NOVO_CADASTRO,
    status: StatusSolicitacaoCliente.PENDENTE,
    solicitadoPorId: usuario.userId,
    solicitadoPorPerfil: usuario.role,
    autorizacaoGerente: usuario.role === Role.GERENTE,
    autorizadoPorGerenteId:
      usuario.role === Role.GERENTE ? usuario.userId : undefined,
    observacaoSolicitacao: data.observacaoSolicitacao,
    dadosSolicitados: {
      cnpj: cnpjLimpo,
      razaoSocial: data.razaoSocial,
      nomeFantasia: data.nomeFantasia,
      subcanalId: data.subcanalId,
      rotaId: data.rotaId,
      sequencia: data.sequencia,
      diaAtendimentoId: data.diaAtendimentoId,
      horarioFuncionamento: data.horarioFuncionamento,
      nomeContato: data.nomeContato,
      telefoneWhatsapp: data.telefoneWhatsapp,
      limiteCredito: data.limiteCredito,
      diasPrazo: data.diasPrazo,
      bloqueioFinanceiro: data.bloqueioFinanceiro,
      fotoInternaUrl: data.fotoInternaUrl,
      fotoExternaUrl: data.fotoExternaUrl,
      vendedorId: data.vendedorId,
      baseId: data.baseId,
    },
  });
},

  async solicitarAlteracaoSensivel(
    usuario: UsuarioAutenticado,
    data: SolicitarAlteracaoSensivelInput
  ) {
    if (!podeSolicitar(usuario)) {
      throw new AppError("Perfil sem permissão para solicitar.", 403);
    }

    const cliente = await clienteRepository.findById(data.clienteId);

    if (!cliente) {
      throw new AppError("Cliente não encontrado.", 404);
    }

    const temCampoSensivel =
      data.limiteCredito !== undefined ||
      data.diasPrazo !== undefined ||
      data.bloqueioFinanceiro !== undefined;

    if (!temCampoSensivel) {
      throw new AppError(
        "Informe ao menos um campo sensível para alteração.",
        400
      );
    }

    return solicitacaoClienteRepository.create({
      tipoSolicitacao: TipoSolicitacaoCliente.ALTERACAO_SENSIVEL,
      status: StatusSolicitacaoCliente.PENDENTE,
      clienteId: cliente.id,
      solicitadoPorId: usuario.userId,
      solicitadoPorPerfil: usuario.role,
      autorizacaoGerente: usuario.role === Role.GERENTE,
      autorizadoPorGerenteId:
        usuario.role === Role.GERENTE ? usuario.userId : undefined,
      motivo: data.motivo,
      observacaoSolicitacao: data.observacaoSolicitacao,
      dadosSolicitados: {
        clienteId: cliente.id,
        limiteCredito: data.limiteCredito,
        diasPrazo: data.diasPrazo,
        bloqueioFinanceiro: data.bloqueioFinanceiro,
        motivo: data.motivo,
      },
    });
  },

  async solicitarAlteracaoNormal(
    usuario: UsuarioAutenticado,
    data: SolicitarAlteracaoNormalInput
  ) {
    if (!podeSolicitar(usuario)) {
      throw new AppError("Perfil sem permissão para solicitar.", 403);
    }

    const cliente = await clienteRepository.findById(data.clienteId);

    if (!cliente) {
      throw new AppError("Cliente não encontrado.", 404);
    }

    const dadosSolicitados = {
      clienteId: cliente.id,
      nomeFantasia: data.nomeFantasia,
      subcanalId: data.subcanalId,
      rotaId: data.rotaId,
      sequencia: data.sequencia,
      diaAtendimentoId: data.diaAtendimentoId,
      horarioFuncionamento: data.horarioFuncionamento,
      nomeContato: data.nomeContato,
      telefoneWhatsapp: data.telefoneWhatsapp,
      fotoInternaUrl: data.fotoInternaUrl,
      fotoExternaUrl: data.fotoExternaUrl,
    };

    const temAlgumaAlteracao = Object.entries(dadosSolicitados).some(
      ([chave, valor]) => chave !== "clienteId" && valor !== undefined
    );

    if (!temAlgumaAlteracao) {
      throw new AppError(
        "Informe ao menos um campo normal para alteração.",
        400
      );
    }

    return solicitacaoClienteRepository.create({
      tipoSolicitacao: TipoSolicitacaoCliente.ALTERACAO_NORMAL,
      status: StatusSolicitacaoCliente.PENDENTE,
      clienteId: cliente.id,
      solicitadoPorId: usuario.userId,
      solicitadoPorPerfil: usuario.role,
      autorizacaoGerente: usuario.role === Role.GERENTE,
      autorizadoPorGerenteId:
        usuario.role === Role.GERENTE ? usuario.userId : undefined,
      observacaoSolicitacao: data.observacaoSolicitacao,
      dadosSolicitados,
    });
  },

  async listarSolicitacoes() {
    return solicitacaoClienteRepository.findAll();
  },

  async buscarSolicitacaoPorId(id: string) {
    const solicitacao = await solicitacaoClienteRepository.findById(id);

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada.", 404);
    }

    return solicitacao;
  },
};