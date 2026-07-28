import { View, Text, StyleSheet } from 'react-native';
import { ProfileHeader } from '../../../src/components/ui/ProfileHeader';

export default function GerenteScreen() {
  return (
    <View style={styles.container}>
      <ProfileHeader title="Tela do Gerente" />

      <View style={styles.content}>
        <Text style={styles.title}>Perfil: GERENTE</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
});