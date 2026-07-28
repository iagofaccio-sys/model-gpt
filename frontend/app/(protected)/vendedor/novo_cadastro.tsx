import { StyleSheet, Text, View } from 'react-native';
import { ProfileHeader } from '../../../src/components/ui/ProfileHeader';

export default function NovoCadastroScreen() {
  return (
    <View style={styles.container}>
      <ProfileHeader title="Novo cadastro" />

      <View style={styles.content}>
        <Text style={styles.text}>Tela de Novo cadastro</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});