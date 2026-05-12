import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { listarUtilizadores, alterarStatusUser, eliminarUser } from '../../services/api';

const corPerfil = {
  admin: '#1B3A6B',
  docente: '#1A6B3A',
  estudante: '#F4A623',
};

export default function UtilizadoresScreen({ navigation }) {
  const [utilizadores, setUtilizadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  useEffect(() => {
    carregarUtilizadores();
  }, []);

  const carregarUtilizadores = async () => {
    try {
      const resposta = await listarUtilizadores();
      setUtilizadores(resposta.data.utilizadores);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar os utilizadores.');
    } finally {
      setCarregando(false);
      setRefrescando(false);
    }
  };

  const handleAlterarStatus = async (utilizador) => {
    const accao = utilizador.activo ? 'desactivar' : 'activar';
    Alert.alert(
      `${accao.charAt(0).toUpperCase() + accao.slice(1)} conta`,
      `Tens a certeza que queres ${accao} a conta de ${utilizador.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await alterarStatusUser(utilizador.id);
              carregarUtilizadores();
            } catch (erro) {
              Alert.alert('Erro', erro.response?.data?.mensagem || 'Erro ao alterar status.');
            }
          }
        }
      ]
    );
  };

  const handleEliminar = async (utilizador) => {
    Alert.alert(
      'Eliminar conta',
      `Tens a certeza que queres eliminar a conta de ${utilizador.nome}? Esta acção não pode ser revertida.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarUser(utilizador.id);
              carregarUtilizadores();
              Alert.alert('✅', 'Conta eliminada com sucesso.');
            } catch (erro) {
              Alert.alert('Erro', erro.response?.data?.mensagem || 'Erro ao eliminar conta.');
            }
          }
        }
      ]
    );
  };

  const renderUtilizador = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTopo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {item.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: corPerfil[item.perfil] }]}>
              <Text style={styles.badgeTexto}>{item.perfil}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: item.activo ? '#1A6B3A' : '#9B1C1C' }]}>
              <Text style={styles.badgeTexto}>{item.activo ? 'Activo' : 'Inactivo'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.accoes}>
        <TouchableOpacity
          style={[styles.botao, { backgroundColor: item.activo ? '#9B1C1C' : '#1A6B3A' }]}
          onPress={() => handleAlterarStatus(item)}
        >
          <Text style={styles.botaoTexto}>
            {item.activo ? 'Desactivar' : 'Activar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, { backgroundColor: '#6B7280' }]}
          onPress={() => handleEliminar(item)}
        >
          <Text style={styles.botaoTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#1B3A6B" />
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
        <Text style={styles.titulo}>Utilizadores</Text>
        <Text style={styles.total}>{utilizadores.length} contas</Text>
      </View>

      <FlatList
        data={utilizadores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUtilizador}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={() => { setRefrescando(true); carregarUtilizadores(); }} />
        }
      />
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
  total: { color: '#A8C4E0', fontSize: 14 },
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
  cardTopo: { flexDirection: 'row', marginBottom: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1B3A6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarTexto: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  info: { flex: 1 },
  nome: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  email: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeTexto: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  accoes: { flexDirection: 'row', gap: 8 },
  botao: { flex: 1, borderRadius: 8, padding: 10, alignItems: 'center' },
  botaoTexto: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
});