import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ProfileHeader } from '../../../../src/components/ui/ProfileHeader';

export default function VendedorDetalheSolicitacaoScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ProfileHeader title="Detalhe da Solicitação" />

      <View style={styles.content}>
        <Text style={styles.text}>ID da solicitação: {String(id)}</Text>
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
  text: {
    fontSize: 16,
  },
});