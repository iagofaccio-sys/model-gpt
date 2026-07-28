import { api } from './api';
import { SolicitacaoCliente } from '../types/solicitacao';

export async function getPendentesOperador(): Promise<SolicitacaoCliente[]> {
  const response = await api.get('/operador/solicitacoes-clientes/pendentes');
  return response.data;
}

export async function getSolicitacaoOperadorById(id: string): Promise<SolicitacaoCliente> {
  const response = await api.get(`/operador/solicitacoes-clientes/${id}`);
  return response.data;
}

export async function assumirSolicitacao(id: string) {
  const response = await api.patch(`/operador/solicitacoes-clientes/${id}/assumir`);
  return response.data;
}

export async function editarDadosSolicitacao(id: string, payload: any) {
  const response = await api.patch(`/operador/solicitacoes-clientes/${id}/editar-dados`, payload);
  return response.data;
}

export async function concluirSolicitacao(id: string, payload: any) {
  const response = await api.patch(`/operador/solicitacoes-clientes/${id}/concluir`, payload);
  return response.data;
}

export async function rejeitarSolicitacao(id: string, payload?: any) {
  const response = await api.patch(`/operador/solicitacoes-clientes/${id}/rejeitar`, payload);
  return response.data;
}

export async function liberarAtualizacao(id: string) {
  const response = await api.patch(`/operador/solicitacoes-clientes/${id}/liberar-atualizacao`);
  return response.data;
}