import { StyleSheet, Text, View } from 'react-native';
import { ProfileHeader } from '../../../src/components/ui/ProfileHeader';

export default function VendedorEquipamentosScreen() {
  return (
    <View style={styles.container}>
      <ProfileHeader title="Equipamentos" />

      <View style={styles.content}>
        <Text style={styles.title}>Equipamentos</Text>
        <Text style={styles.subtitle}>
          Aqui ficará a área de equipamentos do vendedor.
        </Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
});