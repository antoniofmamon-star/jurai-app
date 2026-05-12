import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { verMesa, sugerirJuri, aprovarMesa, gerarDespacho } from '../../services/api';

const corEstado = {
  rascunho: '#6B7280',
  sugerido: '#F4A623',
  aprovado: '#1A6B3A',
  rejeitado: '#9B1C1C',
};

const textoEstado = {
  rascunho: 'Rascunho',
  sugerido: 'Aguarda aprovação',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
};

export default function DetalhesMesaScreen({ route, navigation }) {
  const { mesaId } = route.params;
  const [mesa, setMesa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [carregandoAprovacao, setCarregandoAprovacao] = useState(false);
  const [carregandoDespacho, setCarregandoDespacho] = useState(false);

  useEffect(() => {
    carregarMesa();
  }, []);

  const carregarMesa = async () => {
    try {
      const resposta = await verMesa(mesaId);
      setMesa(resposta.data.mesa);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar a mesa.');
    } finally {
      setCarregando(false);
    }
  };

  const handleSugerirJuri = async () => {
    Alert.alert(
      'Sugerir Júri',
      'O agente IA vai analisar os docentes disponíveis e sugerir o Presidente, 1.º Vogal e Suplente. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, sugerir',
          onPress: async () => {
            setCarregandoIA(true);
            try {
              const resposta = await sugerirJuri(mesaId);
              setMesa(resposta.data.mesa);
              Alert.alert('✅ Sugestão gerada!', 'O agente IA sugeriu os membros do júri. Revê as sugestões e aprova se concordares.');
            } catch (erro) {
              Alert.alert('Erro', erro.response?.data?.mensagem || 'Erro ao gerar sugestão.');
            } finally {
              setCarregandoIA(false);
            }
          }
        }
      ]
    );
  };

  const handleAprovar = async () => {
    Alert.alert(
      'Aprovar Mesa',
      'Tens a certeza que queres aprovar esta mesa? Esta acção não pode ser revertida.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          onPress: async () => {
            setCarregandoAprovacao(true);
            try {
              const resposta = await aprovarMesa(mesaId);
              setMesa(resposta.data.mesa);
              Alert.alert('✅ Mesa aprovada!', 'A mesa foi aprovada com sucesso. Podes agora gerar o despacho oficial.');
            } catch (erro) {
              Alert.alert('Erro', erro.response?.data?.mensagem || 'Erro ao aprovar mesa.');
            } finally {
              setCarregandoAprovacao(false);
            }
          }
        }
      ]
    );
  };

  const handleGerarDespacho = async () => {
    setCarregandoDespacho(true);
    try {
      await gerarDespacho(mesaId);
      Alert.alert('✅ Despacho gerado!', 'O despacho oficial foi gerado com sucesso em PDF.');
    } catch (erro) {
      Alert.alert('Erro', erro.response?.data?.mensagem || 'Erro ao gerar despacho.');
    } finally {
      setCarregandoDespacho(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#1B3A6B" />
      </View>
    );
  }

  if (!mesa) return null;

  const aguardaIA = mesa.presidente === 'Aguardando sugestão da IA';

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Detalhes da Mesa</Text>
        <View style={[styles.badge, { backgroundColor: corEstado[mesa.estado] }]}>
          <Text style={styles.badgeTexto}>{textoEstado[mesa.estado]}</Text>
        </View>
      </View>

      <ScrollView style={styles.conteudo} showsVerticalScrollIndicator={false}>

        {/* DADOS DO ESTUDANTE */}
        <View style={styles.seccao}>
          <Text style={styles.seccaoTitulo}>📚 Dados do Estudante</Text>
          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>Estudante:</Text>
            <Text style={styles.linhaValor}>{mesa.nome_estudante}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>Tema:</Text>
            <Text style={styles.linhaValor}>{mesa.tema}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>Curso:</Text>
            <Text style={styles.linhaValor}>{mesa.curso}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>Ano:</Text>
            <Text style={styles.linhaValor}>{mesa.ano}</Text>
          </View>
          {mesa.data_defesa && (
            <View style={styles.linha}>
              <Text style={styles.linhaLabel}>Data:</Text>
              <Text style={styles.linhaValor}>
                {new Date(mesa.data_defesa).toLocaleDateString('pt-PT')} às {mesa.hora_defesa}
              </Text>
            </View>
          )}
          {mesa.local_defesa && (
            <View style={styles.linha}>
              <Text style={styles.linhaLabel}>Local:</Text>
              <Text style={styles.linhaValor}>{mesa.local_defesa}</Text>
            </View>
          )}
        </View>

        {/* COMPOSIÇÃO DA MESA */}
        <View style={styles.seccao}>
          <Text style={styles.seccaoTitulo}>👥 Composição da Mesa</Text>

          <View style={styles.membro}>
            <Text style={styles.membroCargo}>Presidente</Text>
            <Text style={[styles.membroNome, aguardaIA && styles.aguarda]}>
              {aguardaIA ? '⏳ Aguarda sugestão da IA' : mesa.presidente}
            </Text>
          </View>

          <View style={styles.membro}>
            <Text style={styles.membroCargo}>1.º Vogal</Text>
            <Text style={[styles.membroNome, aguardaIA && styles.aguarda]}>
              {aguardaIA ? '⏳ Aguarda sugestão da IA' : mesa.primeiro_vogal}
            </Text>
          </View>

          <View style={styles.membro}>
            <Text style={styles.membroCargo}>2.º Vogal (Tutor)</Text>
            <Text style={styles.membroNome}>{mesa.segundo_vogal_tutor}</Text>
          </View>

          <View style={styles.membro}>
            <Text style={styles.membroCargo}>Suplente</Text>
            <Text style={[styles.membroNome, aguardaIA && styles.aguarda]}>
              {aguardaIA ? '⏳ Aguarda sugestão da IA' : mesa.suplente}
            </Text>
          </View>

          <View style={styles.membro}>
            <Text style={styles.membroCargo}>Secretário</Text>
            <Text style={styles.membroNome}>{mesa.secretario}</Text>
          </View>
        </View>

        {/* JUSTIFICAÇÃO DA IA */}
        {mesa.justificacao_ia && (
          <View style={styles.seccao}>
            <Text style={styles.seccaoTitulo}>🤖 Justificação do Agente IA</Text>
            <Text style={styles.justificacao}>{mesa.justificacao_ia}</Text>
          </View>
        )}

        {/* ACÇÕES */}
        <View style={styles.accoes}>

          {/* Sugerir júri — só se ainda não foi sugerido */}
          {aguardaIA && (
            <TouchableOpacity
              style={[styles.botao, styles.botaoIA, carregandoIA && styles.botaoDesactivado]}
              onPress={handleSugerirJuri}
              disabled={carregandoIA}
            >
              {carregandoIA
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.botaoTexto}>🤖 Pedir sugestão à IA</Text>
              }
            </TouchableOpacity>
          )}

          {/* Aprovar — só se foi sugerido */}
          {mesa.estado === 'sugerido' && (
            <TouchableOpacity
              style={[styles.botao, styles.botaoAprovar, carregandoAprovacao && styles.botaoDesactivado]}
              onPress={handleAprovar}
              disabled={carregandoAprovacao}
            >
              {carregandoAprovacao
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.botaoTexto}>✅ Aprovar Mesa</Text>
              }
            </TouchableOpacity>
          )}

          {/* Gerar despacho — só se foi aprovado */}
          {mesa.estado === 'aprovado' && (
            <TouchableOpacity
              style={[styles.botao, styles.botaoDespacho, carregandoDespacho && styles.botaoDesactivado]}
              onPress={handleGerarDespacho}
              disabled={carregandoDespacho}
            >
              {carregandoDespacho
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.botaoTexto}>📄 Gerar Despacho PDF</Text>
              }
            </TouchableOpacity>
          )}

          {/* Nova sugestão — se já foi sugerido mas quer nova */}
          {mesa.estado === 'sugerido' && (
            <TouchableOpacity
              style={[styles.botao, styles.botaoNovaSugestao]}
              onPress={handleSugerirJuri}
              disabled={carregandoIA}
            >
              <Text style={styles.botaoTextoSecundario}>🔄 Nova sugestão da IA</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: {
    backgroundColor: '#1B3A6B',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voltar: { color: '#A8C4E0', fontSize: 16 },
  titulo: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeTexto: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  conteudo: { flex: 1 },
  seccao: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  seccaoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B3A6B',
    marginBottom: 12,
  },
  linha: { flexDirection: 'row', marginBottom: 8 },
  linhaLabel: { fontSize: 13, color: '#6B7280', width: 80 },
  linhaValor: { fontSize: 13, color: '#1F2937', flex: 1, fontWeight: '500' },
  membro: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 10,
  },
  membroCargo: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  membroNome: { fontSize: 14, color: '#1F2937', fontWeight: '600' },
  aguarda: { color: '#F4A623', fontStyle: 'italic' },
  justificacao: { fontSize: 13, color: '#4B5563', lineHeight: 20 },
  accoes: { padding: 16, gap: 12 },
  botao: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  botaoIA: { backgroundColor: '#1A6B3A' },
  botaoAprovar: { backgroundColor: '#1B3A6B' },
  botaoDespacho: { backgroundColor: '#4B5563' },
  botaoNovaSugestao: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1B3A6B',
  },
  botaoDesactivado: { backgroundColor: '#9CA3AF' },
  botaoTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  botaoTextoSecundario: { color: '#1B3A6B', fontSize: 15, fontWeight: '600' },
});