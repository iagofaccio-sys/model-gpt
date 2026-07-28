export type BrasilApiCnpjResponse = {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  municipio?: string | null;
  uf?: string | null;
  cep?: string | null;
  qsa?: Array<{
    nome_socio?: string;
    qualificacao_socio?: string;
  }>;
};

export async function consultarCnpjBrasilApi(cnpj: string): Promise<BrasilApiCnpjResponse> {
  const cnpjLimpo = cnpj.replace(/\D/g, '');

  if (cnpjLimpo.length !== 14) {
    throw new Error('CNPJ deve ter 14 dígitos.');
  }

  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);

  if (!response.ok) {
    throw new Error('CNPJ não encontrado na BrasilAPI.');
  }

  return response.json();
}