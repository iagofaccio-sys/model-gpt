import { useCallback, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ProfileHeader } from '../../../src/components/ui/ProfileHeader';
import {
  getSolicitacoesCadastroLocal,
  SolicitacaoCadastroLocal,
} from '../../../src/storage/solicitacoesCadastroStorage';

type StatusOrdem = 'CONCLUIDA' | 'NEGADA' | 'PENDENTE';

type TipoOrdem =
  | 'NOVO_CADASTRO'
  | 'ALTERACAO_PRAZO'
  | 'ATIVACAO'
  | 'INATIVACAO'
  | 'EDICAO';

type Ordem = {
  id: string;
  tipo: TipoOrdem;
  status: StatusOrdem;

  razaoSocial: string;
  codigoCliente?: string;
  vendedor?: string;

  cnpj?: string;
  endereco?: string;
  cidade?: string;
  rota?: string;
  telefone?: string;
  diaVisita?: string;
  sequencia?: string;

  prazoAntigo?: string;
  prazoNovo?: string;

  informacaoAlterada?: string;
};

type AbaOrdens = 'CONCLUIDAS' | 'NEGADAS' | 'PENDENTES' | 'TODAS';

function converterCadastroLocalParaOrdem(item: SolicitacaoCadastroLocal): Ordem {
  return {
    id: item.id,
    tipo: 'NOVO_CADASTRO',
    status: 'PENDENTE',
    razaoSocial: item.razaoSocial,
    cnpj: item.cnpj,
    endereco: item.endereco,
    cidade: item.cidade,
    rota: (item as any).rota,
    vendedor: (item as any).vendedor || 'Vendedor logado',
  };
}

function getTituloOrdem(tipo: TipoOrdem) {
  switch (tipo) {
    case 'NOVO_CADASTRO':
      return 'Novo Cadastro';
    case 'ALTERACAO_PRAZO':
      return 'Alteração Prazo';
    case 'ATIVACAO':
      return 'Ativação';
    case 'INATIVACAO':
      return 'Inativação';
    case 'EDICAO':
      return 'Edição';
    default:
      return 'Ordem';
  }
}

function getLinhaResumo(ordem: Ordem) {
  if (ordem.tipo === 'NOVO_CADASTRO') {
    return ordem.razaoSocial;
  }

  return `${ordem.codigoCliente || 'Sem código'} - ${ordem.razaoSocial}`;
}

export default function VendedorOrdensScreen() {
  const [abaAtiva, setAbaAtiva] = useState<AbaOrdens>('PENDENTES');
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [ordemSelecionada, setOrdemSelecionada] = useState<Ordem | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const cadastrosLocais = await getSolicitacoesCadastroLocal();

        const ordensCadastro = cadastrosLocais.map(converterCadastroLocalParaOrdem);

        const ordensMock: Ordem[] = [
          {
            id: 'prazo-1',
            tipo: 'ALTERACAO_PRAZO',
            status: 'PENDENTE',
            codigoCliente: '0001',
            razaoSocial: 'Cliente Exemplo LTDA',
            prazoAntigo: '0',
            prazoNovo: '10',
          },
          {
            id: 'ativacao-1',
            tipo: 'ATIVACAO',
            status: 'CONCLUIDA',
            codigoCliente: '0002',
            razaoSocial: 'Mercado Modelo',
            cnpj: '00.000.000/0001-00',
            endereco: 'Rua Central, 100',
            cidade: 'Cambui',
            rota: 'Rota 01',
            telefone: '35999999999',
            diaVisita: 'Segunda',
            sequencia: '2',
          },
          {
            id: 'inativacao-1',
            tipo: 'INATIVACAO',
            status: 'NEGADA',
            codigoCliente: '0003',
            razaoSocial: 'Padaria Central',
            cnpj: '11.111.111/0001-11',
            endereco: 'Av. Brasil, 250',
            cidade: 'Pouso Alegre',
            rota: 'Rota 10',
            telefone: '35988888888',
            diaVisita: 'Terça',
            sequencia: '1',
          },
          {
            id: 'edicao-1',
            tipo: 'EDICAO',
            status: 'PENDENTE',
            codigoCliente: '0004',
            razaoSocial: 'Adega Modelo',
            informacaoAlterada: 'Subcanal alterado de Bar para Adega',
          },
        ];

        setOrdens([...ordensCadastro, ...ordensMock]);
      }

      load();
    }, [])
  );

  const ordensFiltradas = ordens.filter((ordem) => {
    if (abaAtiva === 'TODAS') return true;
    if (abaAtiva === 'CONCLUIDAS') return ordem.status === 'CONCLUIDA';
    if (abaAtiva === 'NEGADAS') return ordem.status === 'NEGADA';
    if (abaAtiva === 'PENDENTES') return ordem.status === 'PENDENTE';
    return true;
  });

  function renderDetalhes(ordem: Ordem) {
    if (ordem.tipo === 'NOVO_CADASTRO') {
      return (
        <>
          <Text style={styles.detail}>Vendedor: {ordem.vendedor || '—'}</Text>
          <Text style={styles.detail}>Cidade: {ordem.cidade || '—'}</Text>
          <Text style={styles.detail}>Rota: {ordem.rota || '—'}</Text>
          <Text style={styles.detail}>Endereço: {ordem.endereco || '—'}</Text>
        </>
      );
    }

    if (ordem.tipo === 'ALTERACAO_PRAZO') {
      return (
        <>
          <Text style={styles.detail}>Prazo antigo: {ordem.prazoAntigo || '—'}</Text>
          <Text style={styles.detail}>Prazo novo: {ordem.prazoNovo || '—'}</Text>
        </>
      );
    }

    if (ordem.tipo === 'ATIVACAO' || ordem.tipo === 'INATIVACAO') {
      return (
        <>
          <Text style={styles.detail}>CNPJ: {ordem.cnpj || '—'}</Text>
          <Text style={styles.detail}>Endereço: {ordem.endereco || '—'}</Text>
          <Text style={styles.detail}>Cidade: {ordem.cidade || '—'}</Text>
          <Text style={styles.detail}>Rota: {ordem.rota || '—'}</Text>
          <Text style={styles.detail}>Telefone: {ordem.telefone || '—'}</Text>
          <Text style={styles.detail}>Dia de visita: {ordem.diaVisita || '—'}</Text>
          <Text style={styles.detail}>Sequência: {ordem.sequencia || '—'}</Text>
        </>
      );
    }

    if (ordem.tipo === 'EDICAO') {
      return (
        <Text style={styles.detail}>
          Informação alterada: {ordem.informacaoAlterada || '—'}
        </Text>
      );
    }

    return null;
  }

  return (
    <View style={styles.container}>
      <ProfileHeader title="Ordens" />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, abaAtiva === 'CONCLUIDAS' && styles.tabButtonActive]}
          onPress={() => setAbaAtiva('CONCLUIDAS')}
        >
          <Text style={[styles.tabText, abaAtiva === 'CONCLUIDAS' && styles.tabTextActive]}>
            Concluídas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, abaAtiva === 'NEGADAS' && styles.tabButtonActive]}
          onPress={() => setAbaAtiva('NEGADAS')}
        >
          <Text style={[styles.tabText, abaAtiva === 'NEGADAS' && styles.tabTextActive]}>
            Negadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, abaAtiva === 'PENDENTES' && styles.tabButtonActive]}
          onPress={() => setAbaAtiva('PENDENTES')}
        >
          <Text style={[styles.tabText, abaAtiva === 'PENDENTES' && styles.tabTextActive]}>
            Pendentes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, abaAtiva === 'TODAS' && styles.tabButtonActive]}
          onPress={() => setAbaAtiva('TODAS')}
        >
          <Text style={[styles.tabText, abaAtiva === 'TODAS' && styles.tabTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {ordensFiltradas.length === 0 ? (
          <Text style={styles.empty}>Nenhuma ordem encontrada.</Text>
        ) : (
          ordensFiltradas.map((ordem) => (
            <TouchableOpacity
              key={ordem.id}
              style={styles.card}
              onPress={() => setOrdemSelecionada(ordem)}
            >
              <Text style={styles.cardTitle}>{getTituloOrdem(ordem.tipo)}</Text>
              <Text style={styles.cardSubtitle}>{getLinhaResumo(ordem)}</Text>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{ordem.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={!!ordemSelecionada} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            {ordemSelecionada ? (
              <>
                <Text style={styles.modalTitle}>
                  {getTituloOrdem(ordemSelecionada.tipo)}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {getLinhaResumo(ordemSelecionada)}
                </Text>

                <View style={styles.detailsBox}>{renderDetalhes(ordemSelecionada)}</View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setOrdemSelecionada(null)}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#c90606',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6B7280',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 14,
  },
  detailsBox: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  detail: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 18,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#c90606',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});