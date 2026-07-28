import { AppError } from "../utils/appError";
import { clienteRepository } from "../repositories/cliente.repository";
import { subcanalRepository } from "../repositories/subcanal.repository";
import { rotaRepository } from "../repositories/rota.repository";
import { diaAtendimentoRepository } from "../repositories/diaAtendimento.repository";

export const cadastroClienteService = {
  async listarSubcanais() {
    return subcanalRepository.findAll();
  },

  async listarRotas() {
    return rotaRepository.findAll();
  },

  async listarDiasAtendimento() {
    return diaAtendimentoRepository.findAll();
  },

  async listarClientes() {
    return clienteRepository.findAll();
  },

  async buscarClientePorId(id: string) {
    const cliente = await clienteRepository.findById(id);

    if (!cliente) {
      throw new AppError("Cliente não encontrado.", 404);
    }

    return cliente;
  },
};