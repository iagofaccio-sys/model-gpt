import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ProfileHeader } from '../../../src/components/ui/ProfileHeader';

type IndicadorTab =
  | 'VOLUME'
  | 'COBERTURAS'
  | 'RETORNAVEL'
  | 'DIGITAL'
  | 'NOVAS CATEGORIAS';
  

type VolumeIndicador = {
  categoria: string;
  meta: number;
  real: number;
  tendencia: number;
  falta: number;
  realVsMeta: number;
  tendenciaVsMeta: number;
};

const volumeIndicadores: VolumeIndicador[] = [
  {
    categoria: 'Refrigerante',
    meta: 16000,
    real: 12000,
    tendencia: 16160,
    falta: 4000,
    realVsMeta: 75,
    tendenciaVsMeta: 101,
  },
  {
    categoria: 'Água',
    meta: 1200,
    real: 720,
    tendencia: 780,
    falta: 480,
    realVsMeta: 60,
    tendenciaVsMeta: 65,
  },
];

function formatNumber(value: number) {
  return value.toLocaleString('pt-BR');
}

function formatPercent(value: number) {
  return `${value}%`;
}

function getPercentColor(value: number) {
  if (value >= 100) return '#16A34A';
  if (value >= 80) return '#2563EB';
  return '#DC2626';
}

function IndicadorVolumeCard({
  item,
}: {
  item: VolumeIndicador;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.categoria}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Meta</Text>
        <Text style={styles.value}>
          {formatNumber(item.meta)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Real</Text>
        <Text style={styles.value}>
          {formatNumber(item.real)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tendência</Text>
        <Text style={styles.value}>
          {formatNumber(item.tendencia)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Falta</Text>
        <Text style={styles.value}>
          {formatNumber(item.falta)}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Real vs Meta</Text>

        <Text
          style={[
            styles.percentValue,
            {
              color: getPercentColor(item.realVsMeta),
            },
          ]}
        >
          {formatPercent(item.realVsMeta)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>
          Tendência vs Meta
        </Text>

        <Text
          style={[
            styles.percentValue,
            {
              color: getPercentColor(
                item.tendenciaVsMeta
              ),
            },
          ]}
        >
          {formatPercent(item.tendenciaVsMeta)}
        </Text>
      </View>
    </View>
  );
}

function EmptyIndicador({
  title,
}: {
  title: string;
}) {
  return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyTitle}>{title}</Text>

      <Text style={styles.emptyText}>
        Esta aba será configurada posteriormente.
      </Text>
    </View>
  );
}

export default function VendedorIndicadoresScreen() {
  const [activeTab, setActiveTab] =
    useState<IndicadorTab>('VOLUME');

  return (
    <View style={styles.container}>
      <ProfileHeader title="Indicadores" />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'VOLUME' &&
              styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('VOLUME')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'VOLUME' &&
                styles.tabTextActive,
            ]}
          >
            Volume
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'COBERTURAS' &&
              styles.tabButtonActive,
          ]}
          onPress={() =>
            setActiveTab('COBERTURAS')
          }
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'COBERTURAS' &&
                styles.tabTextActive,
            ]}
          >
            Coberturas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'RETORNAVEL' &&
              styles.tabButtonActive,
          ]}
          onPress={() =>
            setActiveTab('RETORNAVEL')
          }
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'RETORNAVEL' &&
                styles.tabTextActive,
            ]}
          >
            Retornável
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'DIGITAL' &&
              styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('DIGITAL')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'DIGITAL' &&
                styles.tabTextActive,
            ]}
          >
            Digital
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'NOVAS CATEGORIAS' &&
              styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('NOVAS CATEGORIAS')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'NOVAS CATEGORIAS' &&
                styles.tabTextActive,
            ]}
          >
            Novas Categorias
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
      >
        {activeTab === 'VOLUME' ? (
          <>
           

            {volumeIndicadores.map((item) => (
              <IndicadorVolumeCard
                key={item.categoria}
                item={item}
              />
            ))}
          </>
        ) : null}

        {activeTab === 'COBERTURAS' ? (
          <EmptyIndicador title="Coberturas" />
        ) : null}

        {activeTab === 'RETORNAVEL' ? (
          <EmptyIndicador title="Retornável" />
        ) : null}

        {activeTab === 'DIGITAL' ? (
          <EmptyIndicador title="Digital" />
        ) : null}
      </ScrollView>
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
    minHeight: 42,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  tabButtonActive: {
    backgroundColor: '#c90606',
  },

  tabText: {
    fontSize: 11,
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

  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 30,
  },

  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },

  value: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '800',
  },

  percentValue: {
    fontSize: 15,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },

  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});