import { api } from './api';
import { SolicitacaoCliente } from '../types/solicitacao';

export async function criarNovoCadastro(payload: any) {
  const response = await api.post('/solicitacoes-clientes/novo-cadastro', payload);
  return response.data;
}

export async function criarAtivacaoInativacao(payload: any) {
  const response = await api.post('/solicitacoes-clientes/ativacao-inativacao', payload);
  return response.data;
}

export async function criarAlteracaoSensivel(payload: any) {
  const response = await api.post('/solicitacoes-clientes/alteracao-sensivel', payload);
  return response.data;
}

export async function criarAlteracaoNormal(payload: any) {
  const response = await api.post('/solicitacoes-clientes/alteracao-normal', payload);
  return response.data;
}

export async function getSolicitacoes(): Promise<SolicitacaoCliente[]> {
  const response = await api.get('/solicitacoes-clientes');
  return response.data;
}

export async function getSolicitacaoById(id: string): Promise<SolicitacaoCliente> {
  const response = await api.get(`/solicitacoes-clientes/${id}`);
  return response.data;
}
export async function getSolicitacoesPendentesOperador(): Promise<SolicitacaoCliente[]> {
  console.log('CHAMANDO PENDENTES OPERADOR');

  try {
    const response = await api.get('/operador/solicitacoes-clientes/pendentes');

    console.log('STATUS PENDENTES OPERADOR:', response.status);
    console.log('RESPOSTA PENDENTES OPERADOR:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    console.log('ERRO PENDENTES OPERADOR STATUS:', error?.response?.status);
    console.log('ERRO PENDENTES OPERADOR DATA:', error?.response?.data);
    console.log('ERRO PENDENTES OPERADOR MESSAGE:', error?.message);

    throw error;
  }
}

export async function getSolicitacaoOperadorById(id: string): Promise<SolicitacaoCliente> {
  const response = await api.get(`/operador/solicitacoes-clientes/${id}`);
  return response.data;
}

export async function assumirSolicitacaoOperador(id: string) {
  const response = await api.patch(`/operador/solicitacoes-clientes/${id}/assumir`);
  return response.data;
}

export async function concluirSolicitacaoOperador(
  id: string,
  payload: {
    codigoCliente?: string;
    observacaoOperador?: string;
  }
) {
  const response = await api.patch(
    `/operador/solicitacoes-clientes/${id}/concluir`,
    payload
  );

  return response.data;
}

export async function rejeitarSolicitacaoOperador(
  id: string,
  observacaoOperador: string
) {
  const response = await api.patch(
    `/operador/solicitacoes-clientes/${id}/rejeitar`,
    {
      observacaoOperador,
    }
  );

  return response.data;
}

export async function liberarAtualizacaoOperador(
  id: string,
  observacaoOperador?: string
) {
  const response = await api.patch(
    `/operador/solicitacoes-clientes/${id}/liberar-atualizacao`,
    {
      observacaoOperador,
    }
  );

  return response.data;
}