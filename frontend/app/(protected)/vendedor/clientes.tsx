import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { ProfileHeader } from '../../../src/components/ui/ProfileHeader';
import { consultarCnpjBrasilApi } from '../../../src/services/brasilapi.service';
import { criarNovoCadastro } from '../../../src/services/solicitacao.service';

import {
  CIDADES,
  ROTAS_POR_CIDADE,
  SUBCANAIS,
  DIAS_ATENDIMENTO,
  TIPOS_PAGAMENTO,
  PRAZOS_BOLETO,
} from '../../../src/constants/cadastros';

type ClienteTab = 'NOVO_CADASTRO' | 'ATIVOS';

type DadosCnpj = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string | null;
  enderecoCompleto: string;
};

type SelectBoxProps = {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

function SelectBox({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
}: SelectBoxProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.selectWrapper}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.selectBox, disabled && styles.selectBoxDisabled]}
        onPress={() => {
          if (!disabled) setVisible(true);
        }}
      >
        <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
          {value || placeholder}
        </Text>
        <Text style={styles.selectArrow}>⌄</Text>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{label}</Text>

            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  onChange(option);
                  setVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function VendedorClientesScreen() {
  const [activeTab, setActiveTab] = useState<ClienteTab>('ATIVOS');

  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState<DadosCnpj | null>(null);

  const [cidade, setCidade] = useState('');
  const [rota, setRota] = useState('');
  const [subcanal, setSubcanal] = useState('');
  const [sequenciaAtendimento, setSequenciaAtendimento] = useState('');
  const [diaAtendimento, setDiaAtendimento] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState('');
  const [prazo, setPrazo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [responsavelContato, setResponsavelContato] = useState('');

  const [diaSelecionado, setDiaSelecionado] = useState('Segunda');

  const clientesMock = [
    { codigo: '0001', razaoSocial: 'Cliente Exemplo LTDA', dia: 'Segunda', sequencia: 1 },
    { codigo: '0002', razaoSocial: 'Mercado Modelo', dia: 'Segunda', sequencia: 2 },
    { codigo: '0003', razaoSocial: 'Padaria Central', dia: 'Terça', sequencia: 1 },
  ];

  const clientesFiltrados = clientesMock
    .filter((item) => item.dia === diaSelecionado)
    .sort((a, b) => a.sequencia - b.sequencia);

  async function handleConsultarCnpj() {
    try {
      setLoading(true);
      setDados(null);

      const result = await consultarCnpjBrasilApi(cnpj);

      setDados({
        cnpj: result.cnpj,
        razaoSocial: result.razao_social,
        nomeFantasia: result.nome_fantasia,
        enderecoCompleto: [
          result.logradouro,
          result.numero,
          result.complemento,
          result.bairro,
          result.municipio,
          result.uf,
          result.cep,
        ]
          .filter(Boolean)
          .join(', '),
      });
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível consultar o CNPJ.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSolicitarCadastro() {
    if (!dados) return;

    if (
      !cidade ||
      !rota ||
      !subcanal ||
      !sequenciaAtendimento ||
      !diaAtendimento ||
      !tipoPagamento ||
      (tipoPagamento === 'Boleto' && !prazo) ||
      !whatsapp ||
      !responsavelContato
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    await criarNovoCadastro({
  cnpj: dados.cnpj,
  razaoSocial: dados.razaoSocial,
  nomeFantasia: dados.nomeFantasia || dados.razaoSocial,
  subcanalId: subcanal,
  rotaId: rota,
  sequencia: Number(sequenciaAtendimento),
  diaAtendimentoId: diaAtendimento,
  horarioFuncionamento: '08:00 às 18:00',
  nomeContato: responsavelContato,
  telefoneWhatsapp: whatsapp,
  limiteCredito: 0,
  diasPrazo: tipoPagamento === 'Boleto' ? Number(prazo) : 0,
  bloqueioFinanceiro: false,
  fotoInternaUrl: undefined,
  fotoExternaUrl: undefined,
  vendedorId: '', 
  baseId: 'base1',
});

    Alert.alert('Sucesso', 'Solicitação de cadastro criada.');
    router.push('/vendedor/solicitacoes');
  }

  return (
    <View style={styles.container}>
      <ProfileHeader title="Clientes" />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'NOVO_CADASTRO' && styles.tabButtonActive]}
          onPress={() => setActiveTab('NOVO_CADASTRO')}
        >
          <Text style={[styles.tabText, activeTab === 'NOVO_CADASTRO' && styles.tabTextActive]}>
            Novo Cadastro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ATIVOS' && styles.tabButtonActive]}
          onPress={() => setActiveTab('ATIVOS')}
        >
          <Text style={[styles.tabText, activeTab === 'ATIVOS' && styles.tabTextActive]}>
            Ativos
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'NOVO_CADASTRO' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Novo Cadastro</Text>

          <Text style={styles.label}>CNPJ</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o CNPJ"
            value={cnpj}
            onChangeText={setCnpj}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleConsultarCnpj}>
            <Text style={styles.primaryButtonText}>
              {loading ? 'Consultando...' : 'Consultar'}
            </Text>
          </TouchableOpacity>

          {dados ? (
            <View style={styles.card}>
              <Text style={styles.razaoSocial}>{dados.razaoSocial}</Text>

              <Text style={styles.info}>CNPJ: {dados.cnpj}</Text>
              <Text style={styles.info}>Nome Fantasia: {dados.nomeFantasia || '—'}</Text>
              <Text style={styles.info}>
                Endereço Completo: {dados.enderecoCompleto || '—'}
              </Text>

              <SelectBox
                label="Cidade"
                value={cidade}
                placeholder="Selecione a cidade"
                options={CIDADES.map((item) => item.nome)}
                onChange={(value) => {
                  setCidade(value);
                  setRota('');
                }}
              />

              <SelectBox
                label="Rota"
                value={rota}
                placeholder={cidade ? 'Selecione a rota' : 'Selecione uma cidade primeiro'}
                options={ROTAS_POR_CIDADE[cidade] || []}
                onChange={setRota}
                disabled={!cidade}
              />

              <SelectBox
                label="Subcanal"
                value={subcanal}
                placeholder="Selecione o subcanal"
                options={SUBCANAIS}
                onChange={setSubcanal}
              />

              <Text style={styles.label}>Sequência</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1"
                value={sequenciaAtendimento}
                onChangeText={setSequenciaAtendimento}
                keyboardType="numeric"
              />

              <SelectBox
                label="Dia de Atendimento"
                value={diaAtendimento}
                placeholder="Selecione o dia"
                options={DIAS_ATENDIMENTO}
                onChange={setDiaAtendimento}
              />

              <SelectBox
                label="Tipo de Pagamento"
                value={tipoPagamento}
                placeholder="Selecione o tipo"
                options={TIPOS_PAGAMENTO}
                onChange={(value) => {
                  setTipoPagamento(value);
                  if (value !== 'Boleto') setPrazo('');
                }}
              />

              {tipoPagamento === 'Boleto' ? (
                <SelectBox
                  label="Prazo"
                  value={prazo}
                  placeholder="Selecione o prazo"
                  options={PRAZOS_BOLETO}
                  onChange={setPrazo}
                />
              ) : null}

              <Text style={styles.label}>WhatsApp</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 35999999999"
                value={whatsapp}
                onChangeText={setWhatsapp}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Contato</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome do responsável"
                value={responsavelContato}
                onChangeText={setResponsavelContato}
              />

              <TouchableOpacity style={styles.requestButton} onPress={handleSolicitarCadastro}>
                <Text style={styles.primaryButtonText}>Solicitar Cadastro</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Consulta de CNPJ</Text>
              <Text style={styles.emptyText}>
                Ao consultar, o sistema buscará os dados públicos da empresa na BrasilAPI.
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Clientes Ativos</Text>

          <SelectBox
            label="Dia de visita"
            value={diaSelecionado}
            placeholder="Selecione o dia"
            options={DIAS_ATENDIMENTO}
            onChange={setDiaSelecionado}
          />

          <ScrollView contentContainerStyle={styles.cardsContainer}>
            {clientesFiltrados.map((cliente) => (
              <TouchableOpacity key={cliente.codigo} style={styles.clientCard}>
                <Text style={styles.clientCode}>Código: {cliente.codigo}</Text>
                <Text style={styles.clientName}>{cliente.razaoSocial}</Text>
                <Text style={styles.clientInfo}>Dia: {cliente.dia}</Text>
                <Text style={styles.clientInfo}>Sequência: {cliente.sequencia}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    height: 42,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: { backgroundColor: '#c90606' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  content: { flexGrow: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 18 },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  primaryButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#c90606',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  emptyBox: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  card: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  razaoSocial: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  info: { fontSize: 14, color: '#374151', marginBottom: 8 },
  selectWrapper: { marginBottom: 6 },
  selectBox: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectBoxDisabled: { backgroundColor: '#F3F4F6' },
  selectText: { fontSize: 15, color: '#111827' },
  selectPlaceholder: { color: '#9CA3AF' },
  selectArrow: { fontSize: 18, color: '#6B7280' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  modalOption: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#111827',
  },
  requestButton: {
    marginTop: 18,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#c90606',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: { paddingTop: 4, paddingBottom: 24 },
  clientCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clientCode: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  clientName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  clientInfo: { fontSize: 14, color: '#374151', marginBottom: 2 },
});