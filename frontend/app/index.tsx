import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/hooks/useAuth';

export default function Index() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/login" />;
  }

  if (user.role === 'GERENTE') return <Redirect href="/gerente" />;
  if (user.role === 'SUPERVISOR') return <Redirect href="/supervisor" />;
  if (user.role === 'VENDEDOR') return <Redirect href="/vendedor" />;

  return <Redirect href="/operador" />;
}