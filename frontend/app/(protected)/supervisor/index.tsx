import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ProfileHeader } from '../../../src/components/ui/ProfileHeader';

export default function SupervisorScreen() {
  return (
    <View style={styles.container}>
      <ProfileHeader title="Tela do Supervisor" />

      <View style={styles.content}>
        <Text style={styles.title}>Perfil: SUPERVISOR</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/supervisor/solicitacoes')}
        >
          <Text style={styles.buttonText}>Ver solicitações</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1F497D',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});