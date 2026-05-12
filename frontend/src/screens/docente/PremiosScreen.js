import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView
} from 'react-native';
import { verCurriculo, adicionarPremio } from '../../services/api';

export default function PremiosScreen({ navigation }) {
  const [premios, setPremios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [dados, setDados] = useState({ titulo: '', instituicao: '', ano: '', descricao: '' });

  useEffect(() => { carregarPremios(); }, []);

  const carregarPremios = async () => {
    try {
      const resposta = await verCurriculo();
      setPremios(resposta.data.curriculo.premios);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar os prémios.');
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
      await adicionarPremio({ ...dados, ano: parseInt(dados.ano) });
      setModalVisivel(false);
      setDados({ titulo: '', instituicao: '', ano: '', descricao: '' });
      carregarPremios();
      Alert.alert('✅', 'Prémio adicionado com sucesso!');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível adicionar o prémio.');
    } finally {
      setGuardando(false);
    }
  };

  const renderPremio = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTopo}>
        <Text style={styles.trofeu}>🏆</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          {item.instituicao && <Text style={styles.instituicao}>{item.instituicao}</Text>}
          <Text style={styles.ano}>{item.ano}</Text>
        </View>
      </View>
      {item.descricao && <Text style={styles.descricao}>{item.descricao}</Text>}
    </View>
  );

  if (carregando) return <View style={styles.carregando}><ActivityIndicator size="large" color="#1A6B3A" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.tituloCabecalho}>Prémios</Text>
        <TouchableOpacity onPress={() => setModalVisivel(true)}>
          <Text style={styles.adicionar}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {premios.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>🏆</Text>
          <Text style={styles.vazioTexto}>Ainda não tens prémios registados.</Text>
          <TouchableOpacity style={styles.botaoCriar} onPress={() => setModalVisivel(true)}>
            <Text style={styles.botaoCriarTexto}>Adicionar prémio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList data={premios} keyExtractor={(item) => item.id.toString()} renderItem={renderPremio} contentContainerStyle={styles.lista} />
      )}

      <Modal visible={modalVisivel} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalCabecalho}>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={styles.modalCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>Novo Prémio</Text>
            <TouchableOpacity onPress={handleAdicionar} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#1A6B3A" /> : <Text style={styles.modalGuardar}>Guardar</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalConteudo}>
            <Text style={styles.label}>Título *</Text>
            <TextInput style={styles.input} placeholder="Nome do prémio" value={dados.titulo} onChangeText={(v) => setDados(p => ({ ...p, titulo: v }))} />
            <Text style={styles.label}>Instituição</Text>
            <TextInput style={styles.input} placeholder="Entidade que atribuiu o prémio" value={dados.instituicao} onChangeText={(v) => setDados(p => ({ ...p, instituicao: v }))} />
            <Text style={styles.label}>Ano *</Text>
            <TextInput style={styles.input} placeholder="Ex: 2023" value={dados.ano} onChangeText={(v) => setDados(p => ({ ...p, ano: v }))} keyboardType="numeric" />
            <Text style={styles.label}>Descrição</Text>
            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Breve descrição do prémio" value={dados.descricao} onChangeText={(v) => setDados(p => ({ ...p, descricao: v }))} multiline />
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
  cardTopo: { flexDirection: 'row', marginBottom: 8 },
  trofeu: { fontSize: 32, marginRight: 12 },
  cardInfo: { flex: 1 },
  titulo: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  instituicao: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  ano: { fontSize: 13, color: '#1A6B3A', fontWeight: '600' },
  descricao: { fontSize: 13, color: '#4B5563', fontStyle: 'italic' },
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