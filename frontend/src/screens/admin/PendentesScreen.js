import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../services/api';

export default function PendentesScreen({ navigation }) {
  const [pendentes, setPendentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  useEffect(() => {
    carregarPendentes();
  }, []);

  const carregarPendentes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const resposta = await axios.get(`${BASE_URL}/users/pendentes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendentes(resposta.data.pendentes);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar os pedidos pendentes.');
    } finally {
      setCarregando(false);
      setRefrescando(false);
    }
  };

  const handleAprovar = async (utilizador) => {
    Alert.alert(
      'Aprovar registo',
      `Queres aprovar a conta de ${utilizador.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.put(
                `${BASE_URL}/users/${utilizador.id}/aprovar`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Alert.alert('✅', `Conta de ${utilizador.nome} aprovada!`);
              carregarPendentes();
            } catch (erro) {
              Alert.alert('Erro', 'Não foi possível aprovar o registo.');
            }
          }
        }
      ]
    );
  };

  const handleRejeitar = async (utilizador) => {
    Alert.alert(
      'Rejeitar registo',
      `Tens a certeza que queres rejeitar o pedido de ${utilizador.nome}? A conta será eliminada.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rejeitar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(
                `${BASE_URL}/users/${utilizador.id}/rejeitar`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Alert.alert('✅', 'Pedido rejeitado.');
              carregarPendentes();
            } catch (erro) {
              Alert.alert('Erro', 'Não foi possível rejeitar o pedido.');
            }
          }
        }
      ]
    );
  };

  const renderPendente = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTopo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {item.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.contacto}>
            {item.email || item.telefone}
          </Text>
          <View style={[styles.badge, {
            backgroundColor: item.perfil === 'docente' ? '#E6F1FB' : '#FEF3DC'
          }]}>
            <Text style={[styles.badgeTexto, {
              color: item.perfil === 'docente' ? '#185FA5' : '#854F0B'
            }]}>
              {item.perfil === 'docente' ? '👨‍🏫 Docente' : '🎓 Estudante'}
            </Text>
          </View>
        </View>
        <View style={styles.pendenteBadge}>
          <Text style={styles.pendenteBadgeTexto}>Pendente</Text>
        </View>
      </View>

      <Text style={styles.data}>
        Pedido em {new Date(item.createdAt).toLocaleDateString('pt-PT')}
      </Text>

      <View style={styles.accoes}>
        <TouchableOpacity
          style={styles.botaoRejeitar}
          onPress={() => handleRejeitar(item)}
        >
          <Text style={styles.botaoRejeitarTexto}>✕ Rejeitar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoAprovar}
          onPress={() => handleAprovar(item)}
        >
          <Text style={styles.botaoAprovarTexto}>✓ Aprovar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#0F2952" />
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
        <Text style={styles.titulo}>Pedidos Pendentes</Text>
        <View style={styles.contador}>
          <Text style={styles.contadorTexto}>{pendentes.length}</Text>
        </View>
      </View>

      {pendentes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>✅</Text>
          <Text style={styles.vazioTitulo}>Sem pedidos pendentes</Text>
          <Text style={styles.vazioTexto}>
            Todos os pedidos de registo foram processados.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendentes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPendente}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={() => { setRefrescando(true); carregarPendentes(); }}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: {
    backgroundColor: '#0F2952',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voltar: { color: '#A8C4E0', fontSize: 16 },
  titulo: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  contador: {
    backgroundColor: '#E53E3E',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorTexto: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  lista: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTopo: { flexDirection: 'row', marginBottom: 10 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F2952',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarTexto: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  info: { flex: 1 },
  nome: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  contacto: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeTexto: { fontSize: 12, fontWeight: '600' },
  pendenteBadge: {
    backgroundColor: '#FEF3DC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  pendenteBadgeTexto: { color: '#854F0B', fontSize: 11, fontWeight: '600' },
  data: { fontSize: 12, color: '#9CA3AF', marginBottom: 12 },
  accoes: { flexDirection: 'row', gap: 10 },
  botaoRejeitar: {
    flex: 1,
    backgroundColor: '#FDE8E8',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  botaoRejeitarTexto: { color: '#9B1C1C', fontSize: 14, fontWeight: '600' },
  botaoAprovar: {
    flex: 1,
    backgroundColor: '#0F2952',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  botaoAprovarTexto: { color: '#fff', fontSize: 14, fontWeight: '600' },
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  vazioIcone: { fontSize: 56, marginBottom: 16 },
  vazioTitulo: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  vazioTexto: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
});