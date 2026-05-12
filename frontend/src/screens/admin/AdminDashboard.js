import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { listarMesas, listarUtilizadores } from '../../services/api';

export default function AdminDashboard({ navigation }) {
  const { utilizador, logout } = useAuth();
  const [estatisticas, setEstatisticas] = useState({
    totalMesas: 0,
    mesasRascunho: 0,
    mesasSugeridas: 0,
    mesasAprovadas: 0,
    totalUtilizadores: 0,
    totalDocentes: 0,
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const [resMesas, resUsers] = await Promise.all([
        listarMesas(),
        listarUtilizadores()
      ]);

      const mesas = resMesas.data.mesas;
      const users = resUsers.data.utilizadores;

      setEstatisticas({
        totalMesas: mesas.length,
        mesasRascunho: mesas.filter(m => m.estado === 'rascunho').length,
        mesasSugeridas: mesas.filter(m => m.estado === 'sugerido').length,
        mesasAprovadas: mesas.filter(m => m.estado === 'aprovado').length,
        totalUtilizadores: users.length,
        totalDocentes: users.filter(u => u.perfil === 'docente').length,
      });
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar as estatísticas.');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#1B3A6B" />
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
          <Text style={styles.perfil}>Administrador</Text>
        </View>
        <TouchableOpacity style={styles.botaoLogout} onPress={logout}>
          <Text style={styles.botaoLogoutTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* ESTATÍSTICAS */}
      <Text style={styles.seccaoTitulo}>Resumo do Sistema</Text>

      <View style={styles.grelha}>
        <View style={[styles.card, { backgroundColor: '#1B3A6B' }]}>
          <Text style={styles.cardNumero}>{estatisticas.totalMesas}</Text>
          <Text style={styles.cardLabel}>Total de Mesas</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#1A6B3A' }]}>
          <Text style={styles.cardNumero}>{estatisticas.mesasAprovadas}</Text>
          <Text style={styles.cardLabel}>Aprovadas</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#F4A623' }]}>
          <Text style={styles.cardNumero}>{estatisticas.mesasSugeridas}</Text>
          <Text style={styles.cardLabel}>Aguardam aprovação</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#6B7280' }]}>
          <Text style={styles.cardNumero}>{estatisticas.mesasRascunho}</Text>
          <Text style={styles.cardLabel}>Rascunhos</Text>
        </View>
      </View>

      <View style={styles.grelha}>
        <View style={[styles.card, styles.cardLargo, { backgroundColor: '#4B5563' }]}>
          <Text style={styles.cardNumero}>{estatisticas.totalUtilizadores}</Text>
          <Text style={styles.cardLabel}>Utilizadores registados</Text>
        </View>
        <View style={[styles.card, styles.cardLargo, { backgroundColor: '#1B3A6B' }]}>
          <Text style={styles.cardNumero}>{estatisticas.totalDocentes}</Text>
          <Text style={styles.cardLabel}>Docentes activos</Text>
        </View>
      </View>

      {/* ACÇÕES RÁPIDAS */}
      <Text style={styles.seccaoTitulo}>Acções Rápidas</Text>

      <TouchableOpacity
        style={styles.accao}
        onPress={() => navigation.navigate('ListaMesas')}
      >
        <Text style={styles.accaoIcone}>📋</Text>
        <View style={styles.accaoTexto}>
          <Text style={styles.accaoTitulo}>Gerir Mesas de Júri</Text>
          <Text style={styles.accaoDesc}>Ver, criar e aprovar mesas</Text>
        </View>
        <Text style={styles.accaoSeta}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accao}
        onPress={() => navigation.navigate('CriarMesa')}
      >
        <Text style={styles.accaoIcone}>➕</Text>
        <View style={styles.accaoTexto}>
          <Text style={styles.accaoTitulo}>Nova Mesa de Júri</Text>
          <Text style={styles.accaoDesc}>Criar uma nova banca de defesa</Text>
        </View>
        <Text style={styles.accaoSeta}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accao}
        onPress={() => navigation.navigate('Utilizadores')}
      >
        <Text style={styles.accaoIcone}>👥</Text>
        <View style={styles.accaoTexto}>
          <Text style={styles.accaoTitulo}>Gerir Utilizadores</Text>
          <Text style={styles.accaoDesc}>Ver e gerir contas do sistema</Text>
        </View>
        <Text style={styles.accaoSeta}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.accao}
  onPress={() => navigation.navigate('Pendentes')}
>
  <Text style={styles.accaoIcone}>⏳</Text>
  <View style={styles.accaoTexto}>
    <Text style={styles.accaoTitulo}>Pedidos Pendentes</Text>
    <Text style={styles.accaoDesc}>Aprovar ou rejeitar novos registos</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cabecalho: {
    backgroundColor: '#1B3A6B',
    padding: 24,
    paddingTop: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bemVindo: {
    color: '#A8C4E0',
    fontSize: 14,
  },
  nome: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  perfil: {
    color: '#7AA3C8',
    fontSize: 13,
    marginTop: 2,
  },
  botaoLogout: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoLogoutTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  seccaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A6B',
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
  cardLargo: {
    flex: 1,
  },
  cardNumero: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
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
  accaoIcone: {
    fontSize: 28,
    marginRight: 16,
  },
  accaoTexto: {
    flex: 1,
  },
  accaoTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1B3A6B',
  },
  accaoDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  accaoSeta: {
    fontSize: 24,
    color: '#9CA3AF',
  },
});