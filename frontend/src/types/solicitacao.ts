export type TipoSolicitacao =
  | 'ATIVACAO_INATIVACAO'
  | 'NOVO_CADASTRO'
  | 'ALTERACAO_SENSIVEL'
  | 'ALTERACAO_NORMAL';

export type StatusSolicitacao =
  | 'PENDENTE'
  | 'EM_ANALISE'
  | 'AGUARDANDO_AUTORIZACAO'
  | 'AUTORIZADA'
  | 'REJEITADA'
  | 'CONCLUIDA';

export interface SolicitacaoUsuarioResumo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type SolicitacaoCliente = {
  id: string;
  tipoSolicitacao:
    | 'ATIVACAO_INATIVACAO'
    | 'NOVO_CADASTRO'
    | 'ALTERACAO_SENSIVEL'
    | 'ALTERACAO_NORMAL';
  status: 'PENDENTE' | 'EM_ANALISE' | 'CONCLUIDO' | 'REJEITADO';
  acaoAtivacao?: 'ATIVAR' | 'INATIVAR';
  dadosSolicitados: Record<string, any>;
  solicitadoPor?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};