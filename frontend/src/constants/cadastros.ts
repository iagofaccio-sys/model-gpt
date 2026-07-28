export const CIDADES = [
  { id: '1', nome: 'Cambui' },
  { id: '2', nome: 'Pouso Alegre' },
  { id: '3', nome: 'Extrema' },
];

export const ROTAS_POR_CIDADE: Record<string, string[]> = {
  Cambui: ['Rota 01', 'Rota 02', 'Rota 03'],
  'Pouso Alegre': ['Rota 10', 'Rota 11'],
  Extrema: ['Rota 20', 'Rota 21'],
};

export const SUBCANAIS = [
  'Bar',
  'Restaurante',
  'Mercearia',
  'Supermercado',
  'Padaria',
  'Adega',
  'Distribuidora',
];

export const DIAS_ATENDIMENTO = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export const TIPOS_PAGAMENTO = ['Dinheiro', 'Boleto'];

export const PRAZOS_BOLETO = ['0', '5', '10'];