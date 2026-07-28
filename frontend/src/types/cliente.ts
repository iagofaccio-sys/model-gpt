export interface Cliente {
  id: string;
  codigoCliente: string;
  razaoSocial: string;
  nomeFantasia?: string | null;
  cnpj?: string | null;
  email?: string | null;
  telefone?: string | null;
  status?: string | null;
}