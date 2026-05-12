import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { verCurriculo } from '../../services/api';

export default function DocenteDashboard({ navigation }) {
  const { utilizador, logout } = useAuth();
  const [curriculo, setCurriculo] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarCurriculo();
  }, []);

  const carregarCurriculo = async () => {
    try {
      const resposta = await verCurriculo();
      setCurriculo(resposta.data.curriculo);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar o currículo.');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#1A6B3A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.bemVindo}>Bem-vindo,</Text>
          <Text style={styles.nome}>{utilizador?.nome}</Text>
          <Text style={styles.perfil}>Docente</Text>
        </View>
        <TouchableOpacity style={styles.botaoLogout} onPress={logout}>
          <Text style={styles.botaoLogoutTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* RESUMO DO CURRÍCULO */}
      <Text style={styles.seccaoTitulo}>O meu Currículo</Text>

      <View style={styles.grelha}>
        <View style={[styles.card, { backgroundColor: '#1A6B3A' }]}>
          <Text style={styles.cardNumero}>{curriculo?.formacoes?.length || 0}</Text>
          <Text style={styles.cardLabel}>Formações</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#1B3A6B' }]}>
          <Text style={styles.cardNumero}>{curriculo?.publicacoes?.length || 0}</Text>
          <Text style={styles.cardLabel}>Publicações</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#F4A623' }]}>
          <Text style={styles.cardNumero}>{curriculo?.livros?.length || 0}</Text>
          <Text style={styles.cardLabel}>Livros</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#4B5563' }]}>
          <Text style={styles.cardNumero}>{curriculo?.projetos?.length || 0}</Text>
          <Text style={styles.cardLabel}>Projectos</Text>
        </View>
      </View>

      {/* ACÇÕES RÁPIDAS */}
      <Text style={styles.seccaoTitulo}>Gerir Currículo</Text>

      <TouchableOpacity
        style={styles.accao}
        onPress={() => navigation.navigate('Formacao')}
      >
        <Text style={styles.accaoIcone}>🎓</Text>
        <View style={styles.accaoTexto}>
          <Text style={styles.accaoTitulo}>Formação Académica</Text>
          <Text style={styles.accaoDesc}>Gerir graus e instituições</Text>
        </View>
        <Text style={styles.accaoSeta}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accao}
        onPress={() => navigation.navigate('Publicacoes')}
      >
        <Text style={styles.accaoIcone}>📄</Text>
        <View style={styles.accaoTexto}>
          <Text style={styles.accaoTitulo}>Publicações</Text>
          <Text style={styles.accaoDesc}>Artigos, conferências e capítulos</Text>
        </View>
        <Text style={styles.accaoSeta}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accao}
        onPress={() => navigation.navigate('Livros')}
      >
        <Text style={styles.accaoIcone}>📚</Text>
        <View style={styles.accaoTexto}>
          <Text style={styles.accaoTitulo}>Livros</Text>
          <Text style={styles.accaoDesc}>Livros publicados</Text>
        </View>
        <Text style={styles.accaoSeta}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accao}
        onPress={() => navigation.navigate('Premios')}
      >
        <Text style={styles.accaoIcone}>🏆</Text>
        <View style={styles.accaoTexto}>
          <Text style={styles.accaoTitulo}>Prémios</Text>
          <Text style={styles.accaoDesc}>Distinções e reconhecimentos</Text>
        </View>
        <Text style={styles.accaoSeta}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accao}
        onPress={() => navigation.navigate('Projetos')}
      >
        <Text style={styles.accaoIcone}>🔬</Text>
        <View style={styles.accaoTexto}>
          <Text style={styles.accaoTitulo}>Projectos</Text>
          <Text style={styles.accaoDesc}>Projectos de investigação</Text>
        </View>
        <Text style={styles.accaoSeta}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accao}
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.accaoIcone}>🤖</Text>
        <View style={styles.accaoTexto}>
          <Text style={styles.accaoTitulo}>Agente IA</Text>
          <Text style={styles.accaoDesc}>Chat com o assistente JURAI</Text>
        </View>
        <Text style={styles.accaoSeta}>›</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: {
    backgroundColor: '#1A6B3A',
    padding: 24,
    paddingTop: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bemVindo: { color: '#A8D5B5', fontSize: 14 },
  nome: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  perfil: { color: '#7AC49A', fontSize: 13, marginTop: 2 },
  botaoLogout: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoLogoutTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  seccaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A6B3A',
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  grelha: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cardNumero: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  cardLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4 },
  accao: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accaoIcone: { fontSize: 28, marginRight: 16 },
  accaoTexto: { flex: 1 },
  accaoTitulo: { fontSize: 15, fontWeight: '600', color: '#1A6B3A' },
  accaoDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  accaoSeta: { fontSize: 24, color: '#9CA3AF' },
});