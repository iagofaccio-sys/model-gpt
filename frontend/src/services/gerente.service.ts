import { api } from './api';
import { SolicitacaoCliente } from '../types/solicitacao';

export async function getAutorizacoesPendentes(): Promise<SolicitacaoCliente[]> {
  const response = await api.get('/solicitacoes-clientes/autorizacoes/pendentes');
  return response.data;
}

export async function autorizarSolicitacaoGerente(id: string) {
  const response = await api.patch(`/solicitacoes-clientes/${id}/autorizar-gerente`);
  return response.data;
}

export async function rejeitarSolicitacaoGerente(id: string) {
  const response = await api.patch(`/solicitacoes-clientes/${id}/rejeitar-gerente`);
  return response.data;
}