import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView
} from 'react-native';
import { verCurriculo, adicionarFormacao } from '../../services/api';

const graus = ['Licenciatura', 'Mestrado', 'Doutoramento', 'Pós-Doutoramento', 'Outro'];

export default function FormacaoScreen({ navigation }) {
  const [formacoes, setFormacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [dados, setDados] = useState({
    instituicao: '',
    curso: '',
    grau: 'Mestrado',
    ano_inicio: '',
    ano_fim: '',
  });

  useEffect(() => {
    carregarFormacoes();
  }, []);

  const carregarFormacoes = async () => {
    try {
      const resposta = await verCurriculo();
      setFormacoes(resposta.data.curriculo.formacoes);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar as formações.');
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionar = async () => {
    if (!dados.instituicao || !dados.curso || !dados.ano_inicio) {
      Alert.alert('Erro', 'Por favor preenche os campos obrigatórios.');
      return;
    }

    setGuardando(true);
    try {
      await adicionarFormacao({
        ...dados,
        ano_inicio: parseInt(dados.ano_inicio),
        ano_fim: dados.ano_fim ? parseInt(dados.ano_fim) : null,
      });
      setModalVisivel(false);
      setDados({ instituicao: '', curso: '', grau: 'Mestrado', ano_inicio: '', ano_fim: '' });
      carregarFormacoes();
      Alert.alert('✅', 'Formação adicionada com sucesso!');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível adicionar a formação.');
    } finally {
      setGuardando(false);
    }
  };

  const renderFormacao = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTopo}>
        <Text style={styles.grau}>{item.grau}</Text>
        <Text style={styles.anos}>
          {item.ano_inicio} — {item.ano_fim || 'Actual'}
        </Text>
      </View>
      <Text style={styles.curso}>{item.curso}</Text>
      <Text style={styles.instituicao}>{item.instituicao}</Text>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#1A6B3A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Formação Académica</Text>
        <TouchableOpacity onPress={() => setModalVisivel(true)}>
          <Text style={styles.adicionar}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      {formacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>🎓</Text>
          <Text style={styles.vazioTexto}>Ainda não tens formações registadas.</Text>
          <TouchableOpacity style={styles.botaoCriar} onPress={() => setModalVisivel(true)}>
            <Text style={styles.botaoCriarTexto}>Adicionar formação</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={formacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFormacao}
          contentContainerStyle={styles.lista}
        />
      )}

      {/* MODAL ADICIONAR */}
      <Modal visible={modalVisivel} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalCabecalho}>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={styles.modalCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>Nova Formação</Text>
            <TouchableOpacity onPress={handleAdicionar} disabled={guardando}>
              {guardando
                ? <ActivityIndicator color="#1A6B3A" />
                : <Text style={styles.modalGuardar}>Guardar</Text>
              }
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalConteudo}>
            <Text style={styles.label}>Instituição *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Universidade Agostinho Neto"
              value={dados.instituicao}
              onChangeText={(v) => setDados(prev => ({ ...prev, instituicao: v }))}
            />

            <Text style={styles.label}>Curso *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Engenharia Informática"
              value={dados.curso}
              onChangeText={(v) => setDados(prev => ({ ...prev, curso: v }))}
            />

            <Text style={styles.label}>Grau *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.grausContainer}>
              {graus.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.grauBotao, dados.grau === g && styles.grauBotaoActivo]}
                  onPress={() => setDados(prev => ({ ...prev, grau: g }))}
                >
                  <Text style={[styles.grauBotaoTexto, dados.grau === g && styles.grauBotaoTextoActivo]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Ano de Início *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2015"
              value={dados.ano_inicio}
              onChangeText={(v) => setDados(prev => ({ ...prev, ano_inicio: v }))}
              keyboardType="numeric"
            />

               <Text style={styles.label}>Ano de Conclusão</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2017 (deixa em branco se em curso)"
              value={dados.ano_fim}
              onChangeText={(v) => setDados(prev => ({ ...prev, ano_fim: v }))}
              keyboardType="numeric"
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: {
    backgroundColor: '#1A6B3A',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voltar: { color: '#A8D5B5', fontSize: 16 },
  titulo: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  adicionar: { color: '#A8D5B5', fontSize: 16, fontWeight: '600' },
  lista: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  grau: { fontSize: 13, fontWeight: 'bold', color: '#1A6B3A' },
  anos: { fontSize: 13, color: '#6B7280' },
  curso: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  instituicao: { fontSize: 13, color: '#6B7280' },
  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  vazioIcone: { fontSize: 48, marginBottom: 16 },
  vazioTexto: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  botaoCriar: { backgroundColor: '#1A6B3A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  botaoCriarTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: '#F3F4F6' },
  modalCabecalho: {
    backgroundColor: '#FFFFFF',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancelar: { color: '#6B7280', fontSize: 16 },
  modalTitulo: { fontSize: 17, fontWeight: 'bold', color: '#1F2937' },
  modalGuardar: { color: '#1A6B3A', fontSize: 16, fontWeight: 'bold' },
  modalConteudo: { padding: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  grausContainer: { marginBottom: 8 },
  grauBotao: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  grauBotaoActivo: { backgroundColor: '#1A6B3A', borderColor: '#1A6B3A' },
  grauBotaoTexto: { fontSize: 13, color: '#374151' },
  grauBotaoTextoActivo: { color: '#FFFFFF', fontWeight: '600' },
});