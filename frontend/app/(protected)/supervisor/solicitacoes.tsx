import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileHeader } from '../../../src/components/ui/ProfileHeader';
import { Loading } from '../../../src/components/ui/Loading';
import { SolicitacaoCard } from '../../../src/components/solicitacoes/SolicitacaoCard';
import { getSolicitacoes } from '../../../src/services/solicitacao.service';
import { SolicitacaoCliente } from '../../../src/types/solicitacao';

export default function SupervisorSolicitacoesScreen() {
  const router = useRouter();

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadSolicitacoes(showLoader = true) {
    try {
      if (showLoader) setLoading(true);

      const data = await getSolicitacoes();
      setSolicitacoes(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as solicitações.');
    } finally {
      if (showLoader) setLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);
      const data = await getSolicitacoes();
      setSolicitacoes(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a lista.');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadSolicitacoes();
  }, []);

  return (
    <View style={styles.container}>
      <ProfileHeader title="Solicitações do Supervisor" />

      <View style={styles.content}>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={solicitacoes}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma solicitação encontrada.</Text>
            }
            renderItem={({ item }) => (
              <SolicitacaoCard
                solicitacao={item}
                onPress={() =>
                  router.push({
                    pathname: '/supervisor/detalhe/[id]',
                    params: { id: item.id },
                  })
                }
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 15,
  },
});