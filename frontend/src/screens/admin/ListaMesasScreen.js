import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { listarMesas } from '../../services/api';

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

export default function ListaMesasScreen({ navigation }) {
  const [mesas, setMesas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  useEffect(() => {
    carregarMesas();
  }, []);

  const carregarMesas = async () => {
    try {
      const resposta = await listarMesas();
      setMesas(resposta.data.mesas);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar as mesas.');
    } finally {
      setCarregando(false);
      setRefrescando(false);
    }
  };

  const aoRefrescar = () => {
    setRefrescando(true);
    carregarMesas();
  };

  const renderMesa = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetalhesMesa', { mesaId: item.id })}
    >
      <View style={styles.cardTopo}>
        <Text style={styles.estudante}>{item.nome_estudante}</Text>
        <View style={[styles.badge, { backgroundColor: corEstado[item.estado] }]}>
          <Text style={styles.badgeTexto}>{textoEstado[item.estado]}</Text>
        </View>
      </View>

      <Text style={styles.tema} numberOfLines={2}>{item.tema}</Text>

      <View style={styles.cardRodape}>
        <Text style={styles.curso}>{item.curso} — {item.ano}</Text>
        {item.data_defesa && (
          <Text style={styles.data}>
            {new Date(item.data_defesa).toLocaleDateString('pt-PT')}
          </Text>
        )}
      </View>

      <View style={styles.membros}>
        <Text style={styles.membroLabel}>Presidente:</Text>
        <Text style={styles.membroNome} numberOfLines={1}>
          {item.presidente === 'Aguardando sugestão da IA' ? '⏳ Aguarda IA' : item.presidente}
        </Text>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.titulo}>Mesas de Júri</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CriarMesa')}>
          <Text style={styles.novo}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      {mesas.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>📋</Text>
          <Text style={styles.vazioTexto}>Ainda não há mesas criadas.</Text>
          <TouchableOpacity
            style={styles.botaoCriar}
            onPress={() => navigation.navigate('CriarMesa')}
          >
            <Text style={styles.botaoCriarTexto}>Criar primeira mesa</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={mesas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMesa}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={aoRefrescar} />
          }
        />
      )}
    </View>
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
  },
  cabecalho: {
    backgroundColor: '#1B3A6B',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voltar: {
    color: '#A8C4E0',
    fontSize: 16,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  novo: {
    color: '#A8C4E0',
    fontSize: 16,
    fontWeight: '600',
  },
  lista: {
    padding: 16,
  },
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
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  estudante: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A6B',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  badgeTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  tema: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 18,
  },
  cardRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  curso: {
    fontSize: 12,
    color: '#6B7280',
  },
  data: {
    fontSize: 12,
    color: '#6B7280',
  },
  membros: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  membroLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 4,
  },
  membroNome: {
    fontSize: 12,
    color: '#1B3A6B',
    fontWeight: '600',
    flex: 1,
  },
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  vazioIcone: {
    fontSize: 48,
    marginBottom: 16,
  },
  vazioTexto: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  botaoCriar: {
    backgroundColor: '#1B3A6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  botaoCriarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});