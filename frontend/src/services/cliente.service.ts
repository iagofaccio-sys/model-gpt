import { api } from './api';
import { Cliente } from '../types/cliente';

export async function getClientes(): Promise<Cliente[]> {
  const response = await api.get('/clientes');
  return response.data;
}

export async function getClienteById(id: string): Promise<Cliente> {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
}

export async function getSubcanais() {
  const response = await api.get('/subcanais');
  return response.data;
}

export async function getRotas() {
  const response = await api.get('/rotas');
  return response.data;
}

export async function getDiasAtendimento() {
  const response = await api.get('/dias-atendimento');
  return response.data;
}