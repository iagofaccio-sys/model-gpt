import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'solicitacoesCadastroLocal';

export type SolicitacaoCadastroLocal = {
  id: string;
  tipo: 'NOVO_CADASTRO';
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string | null;
  endereco: string;
  cidade: string;
  socios: string[];
  status: 'PENDENTE';
  createdAt: string;
};

async function getRaw() {
  if (Platform.OS === 'web') return localStorage.getItem(KEY);
  return SecureStore.getItemAsync(KEY);
}

async function setRaw(value: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(KEY, value);
    return;
  }

  await SecureStore.setItemAsync(KEY, value);
}

export async function getSolicitacoesCadastroLocal(): Promise<SolicitacaoCadastroLocal[]> {
  const raw = await getRaw();
  return raw ? JSON.parse(raw) : [];
}

export async function addSolicitacaoCadastroLocal(item: SolicitacaoCadastroLocal) {
  const atuais = await getSolicitacoesCadastroLocal();
  await setRaw(JSON.stringify([item, ...atuais]));
}