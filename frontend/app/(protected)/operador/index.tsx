import React, { useCallback, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { clearAuth, getUser } from "../../../src/storage/authStorage";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SolicitacaoCliente } from "../../../src/types/solicitacao";
import {
  assumirSolicitacaoOperador,
  concluirSolicitacaoOperador,
  getSolicitacoesPendentesOperador,
  rejeitarSolicitacaoOperador,
} from "../../../src/services/solicitacao.service";

export default function OperadorScreen() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCliente[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selecionada, setSelecionada] = useState<SolicitacaoCliente | null>(null);
  const [codigoCliente, setCodigoCliente] = useState("");
  const [observacaoOperador, setObservacaoOperador] = useState("");
  const [nomeOperador, setNomeOperador] = useState("");

  async function carregarUsuario() {
    const usuario = await getUser();

    if (usuario?.name) {
      setNomeOperador(usuario.name);
    }
  }

  async function sair() {
    await clearAuth();
    router.replace("/login");
  }

  async function carregarSolicitacoes() {
    try {
      setCarregando(true);

      const data = await getSolicitacoesPendentesOperador();

      const somentePendentes = data.filter((item) => item.status === "PENDENTE");

      setSolicitacoes(somentePendentes);
    } catch (error) {
      console.log("ERRO OPERADOR:", error);

      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao carregar solicitações."
      );
    } finally {
      setCarregando(false);
    }
  }

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await carregarSolicitacoes();
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuario();
    carregarSolicitacoes();
  }, []);

  const novoCadastro = useMemo(
    () => solicitacoes.filter((item) => item.tipoSolicitacao === "NOVO_CADASTRO"),
    [solicitacoes]
  );

  const ativacao = useMemo(
    () =>
      solicitacoes.filter(
        (item) =>
          item.tipoSolicitacao === "ATIVACAO_INATIVACAO" &&
          (item.acaoAtivacao === "ATIVAR" ||
            item.dadosSolicitados?.acao === "ATIVAR")
      ),
    [solicitacoes]
  );

  const inativacao = useMemo(
    () =>
      solicitacoes.filter(
        (item) =>
          item.tipoSolicitacao === "ATIVACAO_INATIVACAO" &&
          (item.acaoAtivacao === "INATIVAR" ||
            item.dadosSolicitados?.acao === "INATIVAR")
      ),
    [solicitacoes]
  );

  const alteracaoPrazo = useMemo(
    () =>
      solicitacoes.filter(
        (item) =>
          item.tipoSolicitacao === "ALTERACAO_SENSIVEL" &&
          item.dadosSolicitados?.diasPrazo !== undefined
      ),
    [solicitacoes]
  );

  function abrirSolicitacao(solicitacao: SolicitacaoCliente) {
    setSelecionada(solicitacao);
    setCodigoCliente("");
    setObservacaoOperador("");
  }

  function fecharModal() {
    setSelecionada(null);
    setCodigoCliente("");
    setObservacaoOperador("");
  }

  async function assumirSelecionada() {
    if (!selecionada) return;

    try {
      await assumirSolicitacaoOperador(selecionada.id);
      Alert.alert("Sucesso", "Solicitação assumida.");
      fecharModal();
      carregarSolicitacoes();
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao assumir solicitação."
      );
    }
  }

  async function concluirSelecionada() {
    if (!selecionada) return;

    if (selecionada.tipoSolicitacao === "NOVO_CADASTRO" && !codigoCliente.trim()) {
      Alert.alert(
        "Atenção",
        "Informe o código do cliente para concluir o novo cadastro."
      );
      return;
    }

    try {
      await concluirSolicitacaoOperador(selecionada.id, {
        codigoCliente:
          selecionada.tipoSolicitacao === "NOVO_CADASTRO"
            ? codigoCliente.trim()
            : undefined,
        observacaoOperador:
          observacaoOperador.trim() || "Solicitação concluída pelo operador.",
      });

      Alert.alert("Sucesso", "Solicitação concluída.");
      fecharModal();
      carregarSolicitacoes();
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao concluir solicitação."
      );
    }
  }

  async function negarSelecionada() {
    if (!selecionada) return;

    if (!observacaoOperador.trim()) {
      Alert.alert("Atenção", "Informe uma observação para negar a solicitação.");
      return;
    }

    try {
      await rejeitarSolicitacaoOperador(selecionada.id, observacaoOperador.trim());

      Alert.alert("Sucesso", "Solicitação negada.");
      fecharModal();
      carregarSolicitacoes();
    } catch (error) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro ao negar solicitação."
      );
    }
  }

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.ola}>Olá, {nomeOperador || "Operador"}</Text>
          <Text style={styles.title}>Tela Operador</Text>
          <Text style={styles.subtitle}>Solicitações pendentes</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={sair}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#c90606" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.sectionTitle}>Solicitações</Text>

          <View style={styles.mainBox}>
            <Text style={styles.mainBoxTitle}>Clientes</Text>

            <Quadro titulo="Novo cadastro" dados={novoCadastro} onPressCard={abrirSolicitacao} />
            <Quadro titulo="Ativação" dados={ativacao} onPressCard={abrirSolicitacao} />
            <Quadro titulo="Inativação" dados={inativacao} onPressCard={abrirSolicitacao} />
            <Quadro titulo="Alteração prazo" dados={alteracaoPrazo} onPressCard={abrirSolicitacao} />
          </View>

          <View style={styles.mainBox}>
            <Text style={styles.mainBoxTitle}>Equipamentos</Text>

            <Quadro titulo="Instalação" dados={[]} onPressCard={abrirSolicitacao} />
            <Quadro titulo="Retirada" dados={[]} onPressCard={abrirSolicitacao} />
            <Quadro titulo="Movimentação Fábrica" dados={[]} onPressCard={abrirSolicitacao} />
            <Quadro titulo="Estoque" dados={[]} onPressCard={abrirSolicitacao} />
          </View>
        </ScrollView>
      )}

      <Modal visible={!!selecionada} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>Detalhes da solicitação</Text>

              <Text style={styles.label}>Vendedor</Text>
              <Text style={styles.value}>
                {selecionada?.solicitadoPor?.name || "Não informado"}
              </Text>

              <Text style={styles.label}>Tipo</Text>
              <Text style={styles.value}>{selecionada?.tipoSolicitacao}</Text>

              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{selecionada?.status}</Text>

              <Text style={styles.label}>Informações enviadas</Text>
              <Text style={styles.jsonText}>
                {JSON.stringify(selecionada?.dadosSolicitados, null, 2)}
              </Text>

              {selecionada?.tipoSolicitacao === "NOVO_CADASTRO" && (
                <>
                  <Text style={styles.label}>Código do cliente</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Informe o código do cliente"
                    value={codigoCliente}
                    onChangeText={setCodigoCliente}
                  />
                </>
              )}

              <Text style={styles.label}>Observação do operador</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite uma observação"
                value={observacaoOperador}
                onChangeText={setObservacaoOperador}
                multiline
              />

              <TouchableOpacity style={styles.assumirButton} onPress={assumirSelecionada}>
                <Text style={styles.buttonText}>Assumir</Text>
              </TouchableOpacity>

              <View style={styles.row}>
                <TouchableOpacity style={styles.concluirButton} onPress={concluirSelecionada}>
                  <Text style={styles.buttonText}>Concluída</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.negarButton} onPress={negarSelecionada}>
                  <Text style={styles.buttonText}>Negada</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.fecharButton} onPress={fecharModal}>
                <Text style={styles.fecharText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

type QuadroProps = {
  titulo: string;
  dados: SolicitacaoCliente[];
  onPressCard: (solicitacao: SolicitacaoCliente) => void;
};

function Quadro({ titulo, dados, onPressCard }: QuadroProps) {
  return (
    <View style={styles.quadro}>
      <Text style={styles.quadroTitle}>{titulo}</Text>

      {dados.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma pendente</Text>
      ) : (
        dados.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => onPressCard(item)}>
            <Text style={styles.cardTitle}>
              {item.solicitadoPor?.name || "Vendedor não informado"}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#e5e5e5", padding: 16 },
  header: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ola: { fontSize: 18, color: "#666", marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "700", color: "#111" },
  subtitle: { color: "#666", marginTop: 4 },
  logoutButton: {
    backgroundColor: "#c90606",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: { color: "#fff", fontWeight: "700" },
  loading: { flex: 1, justifyContent: "center" },
  content: { paddingBottom: 30 },
  sectionTitle: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  mainBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    gap: 12,
  },
  mainBoxTitle: { fontSize: 20, fontWeight: "700", color: "#c90606" },
  quadro: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  quadroTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  emptyText: { color: "#888", fontSize: 13 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: { fontWeight: "700", color: "#333" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 16,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    maxHeight: "88%",
  },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginTop: 10,
  },
  value: { fontSize: 15, color: "#111", marginTop: 3 },
  jsonText: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    fontSize: 12,
  },
  input: {
    width: "100%",
    padding: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 6,
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  assumirButton: {
    backgroundColor: "#68686d",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  concluirButton: {
    flex: 1,
    backgroundColor: "#198754",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  negarButton: {
    flex: 1,
    backgroundColor: "#c90606",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  fecharButton: { marginTop: 10, alignItems: "center", padding: 10 },
  fecharText: { color: "#555", fontWeight: "600" },
});