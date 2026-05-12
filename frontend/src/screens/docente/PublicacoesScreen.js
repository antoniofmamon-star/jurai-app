import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView
} from 'react-native';
import { verCurriculo, adicionarPublicacao } from '../../services/api';

const tipos = ['Artigo', 'Conferência', 'Capítulo', 'Outro'];

export default function PublicacoesScreen({ navigation }) {
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [dados, setDados] = useState({
    titulo: '', tipo: 'Artigo', ano: '', doi: '', revista: '', link_pdf: ''
  });

  useEffect(() => { carregarPublicacoes(); }, []);

  const carregarPublicacoes = async () => {
    try {
      const resposta = await verCurriculo();
      setPublicacoes(resposta.data.curriculo.publicacoes);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar as publicações.');
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
      await adicionarPublicacao({ ...dados, ano: parseInt(dados.ano) });
      setModalVisivel(false);
      setDados({ titulo: '', tipo: 'Artigo', ano: '', doi: '', revista: '', link_pdf: '' });
      carregarPublicacoes();
      Alert.alert('✅', 'Publicação adicionada com sucesso!');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível adicionar a publicação.');
    } finally {
      setGuardando(false);
    }
  };

  const renderPublicacao = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTopo}>
        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>{item.tipo}</Text>
        </View>
        <Text style={styles.ano}>{item.ano}</Text>
      </View>
      <Text style={styles.titulo}>{item.titulo}</Text>
      {item.revista && <Text style={styles.revista}>{item.revista}</Text>}
      {item.doi && <Text style={styles.doi}>DOI: {item.doi}</Text>}
    </View>
  );

  if (carregando) return <View style={styles.carregando}><ActivityIndicator size="large" color="#1A6B3A" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.tituloCabecalho}>Publicações</Text>
        <TouchableOpacity onPress={() => setModalVisivel(true)}>
          <Text style={styles.adicionar}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {publicacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>📄</Text>
          <Text style={styles.vazioTexto}>Ainda não tens publicações registadas.</Text>
          <TouchableOpacity style={styles.botaoCriar} onPress={() => setModalVisivel(true)}>
            <Text style={styles.botaoCriarTexto}>Adicionar publicação</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList data={publicacoes} keyExtractor={(item) => item.id.toString()} renderItem={renderPublicacao} contentContainerStyle={styles.lista} />
      )}

      <Modal visible={modalVisivel} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalCabecalho}>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={styles.modalCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>Nova Publicação</Text>
            <TouchableOpacity onPress={handleAdicionar} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#1A6B3A" /> : <Text style={styles.modalGuardar}>Guardar</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalConteudo}>
            <Text style={styles.label}>Título *</Text>
            <TextInput style={[styles.input, styles.inputMulti]} placeholder="Título da publicação" value={dados.titulo} onChangeText={(v) => setDados(p => ({ ...p, titulo: v }))} multiline />
            <Text style={styles.label}>Tipo *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tipos.map((t) => (
                <TouchableOpacity key={t} style={[styles.tipoBotao, dados.tipo === t && styles.tipoBotaoActivo]} onPress={() => setDados(p => ({ ...p, tipo: t }))}>
                  <Text style={[styles.tipoBotaoTexto, dados.tipo === t && styles.tipoBotaoTextoActivo]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.label}>Ano *</Text>
            <TextInput style={styles.input} placeholder="Ex: 2024" value={dados.ano} onChangeText={(v) => setDados(p => ({ ...p, ano: v }))} keyboardType="numeric" />
            <Text style={styles.label}>Revista / Conferência</Text>
            <TextInput style={styles.input} placeholder="Nome da revista ou conferência" value={dados.revista} onChangeText={(v) => setDados(p => ({ ...p, revista: v }))} />
            <Text style={styles.label}>DOI</Text>
            <TextInput style={styles.input} placeholder="Ex: 10.1000/xyz123" value={dados.doi} onChangeText={(v) => setDados(p => ({ ...p, doi: v }))} />
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
  cardTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badge: { backgroundColor: '#1A6B3A', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeTexto: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  ano: { fontSize: 13, color: '#6B7280' },
  titulo: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  revista: { fontSize: 13, color: '#6B7280' },
  doi: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
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
  inputMulti: { height: 80, textAlignVertical: 'top' },
  tipoBotao: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, backgroundColor: '#FFFFFF' },
  tipoBotaoActivo: { backgroundColor: '#1A6B3A', borderColor: '#1A6B3A' },
  tipoBotaoTexto: { fontSize: 13, color: '#374151' },
  tipoBotaoTextoActivo: { color: '#FFFFFF', fontWeight: '600' },});