import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView
} from 'react-native';
import { verCurriculo, adicionarLivro } from '../../services/api';

export default function LivrosScreen({ navigation }) {
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [dados, setDados] = useState({ titulo: '', editora: '', ano: '', isbn: '' });

  useEffect(() => { carregarLivros(); }, []);

  const carregarLivros = async () => {
    try {
      const resposta = await verCurriculo();
      setLivros(resposta.data.curriculo.livros);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar os livros.');
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionar = async () => {
    if (!dados.titulo || !dados.ano) {
      Alert.alert('Erro', 'Por favor preenche o título e o ano.');
      return;
    }
    setGuardando(true);
    try {
      await adicionarLivro({ ...dados, ano: parseInt(dados.ano) });
      setModalVisivel(false);
      setDados({ titulo: '', editora: '', ano: '', isbn: '' });
      carregarLivros();
      Alert.alert('✅', 'Livro adicionado com sucesso!');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível adicionar o livro.');
    } finally {
      setGuardando(false);
    }
  };

  const renderLivro = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      {item.editora && <Text style={styles.editora}>{item.editora}</Text>}
      <View style={styles.cardRodape}>
        <Text style={styles.ano}>{item.ano}</Text>
        {item.isbn && <Text style={styles.isbn}>ISBN: {item.isbn}</Text>}
      </View>
    </View>
  );

  if (carregando) return <View style={styles.carregando}><ActivityIndicator size="large" color="#1A6B3A" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.tituloCabecalho}>Livros</Text>
        <TouchableOpacity onPress={() => setModalVisivel(true)}>
          <Text style={styles.adicionar}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {livros.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>📚</Text>
          <Text style={styles.vazioTexto}>Ainda não tens livros registados.</Text>
          <TouchableOpacity style={styles.botaoCriar} onPress={() => setModalVisivel(true)}>
            <Text style={styles.botaoCriarTexto}>Adicionar livro</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList data={livros} keyExtractor={(item) => item.id.toString()} renderItem={renderLivro} contentContainerStyle={styles.lista} />
      )}

      <Modal visible={modalVisivel} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalCabecalho}>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={styles.modalCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>Novo Livro</Text>
            <TouchableOpacity onPress={handleAdicionar} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#1A6B3A" /> : <Text style={styles.modalGuardar}>Guardar</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalConteudo}>
            <Text style={styles.label}>Título *</Text>
            <TextInput style={styles.input} placeholder="Título do livro" value={dados.titulo} onChangeText={(v) => setDados(p => ({ ...p, titulo: v }))} />
            <Text style={styles.label}>Editora</Text>
            <TextInput style={styles.input} placeholder="Nome da editora" value={dados.editora} onChangeText={(v) => setDados(p => ({ ...p, editora: v }))} />
            <Text style={styles.label}>Ano *</Text>
            <TextInput style={styles.input} placeholder="Ex: 2023" value={dados.ano} onChangeText={(v) => setDados(p => ({ ...p, ano: v }))} keyboardType="numeric" />
            <Text style={styles.label}>ISBN</Text>
            <TextInput style={styles.input} placeholder="Ex: 978-3-16-148410-0" value={dados.isbn} onChangeText={(v) => setDados(p => ({ ...p, isbn: v }))} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: { backgroundColor: '#1A6B3A', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voltar: { color: '#A8D5B5', fontSize: 16 },
  tituloCabecalho: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  adicionar: { color: '#A8D5B5', fontSize: 16, fontWeight: '600' },
  lista: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  titulo: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  editora: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  cardRodape: { flexDirection: 'row', justifyContent: 'space-between' },
  ano: { fontSize: 13, color: '#1A6B3A', fontWeight: '600' },
  isbn: { fontSize: 12, color: '#9CA3AF' },
  vazio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  vazioIcone: { fontSize: 48, marginBottom: 16 },
  vazioTexto: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  botaoCriar: { backgroundColor: '#1A6B3A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  botaoCriarTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: '#F3F4F6' },
  modalCabecalho: { backgroundColor: '#FFFFFF', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalCancelar: { color: '#6B7280', fontSize: 16 },
  modalTitulo: { fontSize: 17, fontWeight: 'bold', color: '#1F2937' },
  modalGuardar: { color: '#1A6B3A', fontSize: 16, fontWeight: 'bold' },
  modalConteudo: { padding: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 14, color: '#333' },
});