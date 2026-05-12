import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView
} from 'react-native';
import { verCurriculo, adicionarProjeto } from '../../services/api';

export default function ProjetosScreen({ navigation }) {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [dados, setDados] = useState({ titulo: '', descricao: '', ano_inicio: '', ano_fim: '', financiador: '' });

  useEffect(() => { carregarProjetos(); }, []);

  const carregarProjetos = async () => {
    try {
      const resposta = await verCurriculo();
      setProjetos(resposta.data.curriculo.projetos);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar os projectos.');
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionar = async () => {
    if (!dados.titulo || !dados.ano_inicio) {
      Alert.alert('Erro', 'Por favor preenche o título e o ano de início.');
      return;
    }
    setGuardando(true);
    try {
      await adicionarProjeto({ ...dados, ano_inicio: parseInt(dados.ano_inicio), ano_fim: dados.ano_fim ? parseInt(dados.ano_fim) : null });
      setModalVisivel(false);
      setDados({ titulo: '', descricao: '', ano_inicio: '', ano_fim: '', financiador: '' });
      carregarProjetos();
      Alert.alert('✅', 'Projecto adicionado com sucesso!');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível adicionar o projecto.');
    } finally {
      setGuardando(false);
    }
  };

  const renderProjeto = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      {item.descricao && <Text style={styles.descricao}>{item.descricao}</Text>}
      <View style={styles.cardRodape}>
        <Text style={styles.anos}>{item.ano_inicio} — {item.ano_fim || 'Em curso'}</Text>
        {item.financiador && <Text style={styles.financiador}>{item.financiador}</Text>}
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
        <Text style={styles.tituloCabecalho}>Projectos</Text>
        <TouchableOpacity onPress={() => setModalVisivel(true)}>
          <Text style={styles.adicionar}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {projetos.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>🔬</Text>
          <Text style={styles.vazioTexto}>Ainda não tens projectos registados.</Text>
          <TouchableOpacity style={styles.botaoCriar} onPress={() => setModalVisivel(true)}>
            <Text style={styles.botaoCriarTexto}>Adicionar projecto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList data={projetos} keyExtractor={(item) => item.id.toString()} renderItem={renderProjeto} contentContainerStyle={styles.lista} />
      )}

      <Modal visible={modalVisivel} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalCabecalho}>
            <TouchableOpacity onPress={() => setModalVisivel(false)}>
              <Text style={styles.modalCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>Novo Projecto</Text>
            <TouchableOpacity onPress={handleAdicionar} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#1A6B3A" /> : <Text style={styles.modalGuardar}>Guardar</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalConteudo}>
            <Text style={styles.label}>Título *</Text>
            <TextInput style={styles.input} placeholder="Nome do projecto" value={dados.titulo} onChangeText={(v) => setDados(p => ({ ...p, titulo: v }))} />
            <Text style={styles.label}>Descrição</Text>
            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Breve descrição do projecto" value={dados.descricao} onChangeText={(v) => setDados(p => ({ ...p, descricao: v }))} multiline />
            <Text style={styles.label}>Ano de Início *</Text>
            <TextInput style={styles.input} placeholder="Ex: 2022" value={dados.ano_inicio} onChangeText={(v) => setDados(p => ({ ...p, ano_inicio: v }))} keyboardType="numeric" />
            <Text style={styles.label}>Ano de Conclusão</Text>
            <TextInput style={styles.input} placeholder="Ex: 2024 (deixa em branco se em curso)" value={dados.ano_fim} onChangeText={(v) => setDados(p => ({ ...p, ano_fim: v }))} keyboardType="numeric" />
            <Text style={styles.label}>Financiador</Text>
            <TextInput style={styles.input} placeholder="Entidade financiadora" value={dados.financiador} onChangeText={(v) => setDados(p => ({ ...p, financiador: v }))} />
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
  descricao: { fontSize: 13, color: '#4B5563', marginBottom: 8 },
  cardRodape: { flexDirection: 'row', justifyContent: 'space-between' },
  anos: { fontSize: 13, color: '#1A6B3A', fontWeight: '600' },
  financiador: { fontSize: 12, color: '#9CA3AF' },
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