import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SolicitacaoCliente } from '../../types/solicitacao';

type Props = {
  solicitacao: SolicitacaoCliente;
  onPress?: () => void;
};

function getTipoLabel(tipo: SolicitacaoCliente['tipo']) {
  switch (tipo) {
    case 'ATIVACAO_INATIVACAO':
      return 'Ativação / Inativação';
    case 'NOVO_CADASTRO':
      return 'Novo Cadastro';
    case 'ALTERACAO_SENSIVEL':
      return 'Alteração Sensível';
    case 'ALTERACAO_NORMAL':
      return 'Alteração Normal';
    default:
      return tipo;
  }
}

function getStatusLabel(status: SolicitacaoCliente['status']) {
  switch (status) {
    case 'PENDENTE':
      return 'Pendente';
    case 'EM_ANALISE':
      return 'Em análise';
    case 'AGUARDANDO_AUTORIZACAO':
      return 'Aguardando autorização';
    case 'AUTORIZADA':
      return 'Autorizada';
    case 'REJEITADA':
      return 'Rejeitada';
    case 'CONCLUIDA':
      return 'Concluída';
    default:
      return status;
  }
}

function getStatusStyle(status: SolicitacaoCliente['status']) {
  switch (status) {
    case 'PENDENTE':
      return styles.statusPendente;
    case 'EM_ANALISE':
      return styles.statusEmAnalise;
    case 'AGUARDANDO_AUTORIZACAO':
      return styles.statusAguardando;
    case 'AUTORIZADA':
      return styles.statusAutorizada;
    case 'REJEITADA':
      return styles.statusRejeitada;
    case 'CONCLUIDA':
      return styles.statusConcluida;
    default:
      return styles.statusPendente;
  }
}

export function SolicitacaoCard({ solicitacao, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.id}>#{solicitacao.id}</Text>

        <View style={[styles.badge, getStatusStyle(solicitacao.status)]}>
          <Text style={styles.badgeText}>{getStatusLabel(solicitacao.status)}</Text>
        </View>
      </View>

      <Text style={styles.tipo}>{getTipoLabel(solicitacao.tipo)}</Text>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Cliente ID</Text>
        <Text style={styles.value}>{solicitacao.clienteId || '—'}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Código Cliente</Text>
        <Text style={styles.value}>{solicitacao.codigoCliente || '—'}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Solicitante</Text>
        <Text style={styles.value}>{solicitacao.solicitante?.name || '—'}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Atualização: {solicitacao.atualizacao ? 'Sim' : 'Não'}
        </Text>

        <Text style={styles.footerText}>
          {new Date(solicitacao.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  id: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  statusPendente: {
    backgroundColor: '#D97706',
  },
  statusEmAnalise: {
    backgroundColor: '#2563EB',
  },
  statusAguardando: {
    backgroundColor: '#7C3AED',
  },
  statusAutorizada: {
    backgroundColor: '#059669',
  },
  statusRejeitada: {
    backgroundColor: '#DC2626',
  },
  statusConcluida: {
    backgroundColor: '#16A34A',
  },
  tipo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    marginBottom: 12,
  },
  infoBlock: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  footerRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});