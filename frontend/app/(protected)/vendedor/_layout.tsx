import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function VendedorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#c90606',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Indicadores',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-line"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="equipamentos"
        options={{
          title: 'Equipamentos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="fridge-alert"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="solicitacoes"
        options={{
          title: 'Ordens',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="file-document-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

     
      <Tabs.Screen
        name="alterar-subcanal"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="alterar-prazo"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="detalhe/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}