import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { listarMesas } from '../../services/api';

export default function EstudanteDashboard({ navigation }) {
  const { utilizador, logout } = useAuth();
  const [mesas, setMesas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarMesas();
  }, []);

  const carregarMesas = async () => {
    try {
      const resposta = await listarMesas();
      // Filtrar apenas as mesas do estudante pelo nome
      const minhasMesas = resposta.data.mesas.filter(
        m => m.nome_estudante.toLowerCase().includes(utilizador?.nome.toLowerCase())
      );
      setMesas(minhasMesas);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível carregar as suas bancas.');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#F4A623" />
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
          <Text style={styles.perfil}>Estudante</Text>
        </View>
        <TouchableOpacity style={styles.botaoLogout} onPress={logout}>
          <Text style={styles.botaoLogoutTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* ESTADO DO PROCESSO */}
      <Text style={styles.seccaoTitulo}>O meu Processo de Defesa</Text>

      {mesas.length === 0 ? (
        <View style={styles.semBanca}>
          <Text style={styles.semBancaIcone}>📋</Text>
          <Text style={styles.semBancaTitulo}>Ainda sem banca agendada</Text>
          <Text style={styles.semBancaTexto}>
            Quando a tua mesa de júri for constituída pelo departamento, aparecerá aqui com todos os detalhes.
          </Text>
        </View>
      ) : (
        mesas.map((mesa) => (
          <View key={mesa.id} style={styles.bancaCard}>
            {/* Estado */}
            <View style={[styles.estadoBarra, {
              backgroundColor: mesa.estado === 'aprovado' ? '#1A6B3A' :
                mesa.estado === 'sugerido' ? '#F4A623' : '#6B7280'
            }]}>
              <Text style={styles.estadoTexto}>
                {mesa.estado === 'aprovado' ? '✅ Banca Oficial' :
                  mesa.estado === 'sugerido' ? '⏳ Em análise' : '📝 Em preparação'}
              </Text>
            </View>

            <View style={styles.bancaConteudo}>
              {/* Tema */}
              <Text style={styles.bancaLabel}>Tema da Defesa</Text>
              <Text style={styles.bancaTema}>{mesa.tema}</Text>

              {/* Curso */}
              <Text style={styles.bancaLabel}>Curso</Text>
              <Text style={styles.bancaValor}>{mesa.curso} — {mesa.ano}</Text>

              {/* Data */}
              {mesa.data_defesa && (
                <>
                  <Text style={styles.bancaLabel}>Data e Hora</Text>
                  <Text style={styles.bancaValor}>
                    {new Date(mesa.data_defesa).toLocaleDateString('pt-PT')} às {mesa.hora_defesa}
                  </Text>
                </>
              )}

              {/* Local */}
              {mesa.local_defesa && (
                <>
                  <Text style={styles.bancaLabel}>Local</Text>
                  <Text style={styles.bancaValor}>{mesa.local_defesa}</Text>
                </>
              )}

              {/* Composição da mesa — só mostra se aprovado */}
              {mesa.estado === 'aprovado' && (
                <>
                  <View style={styles.separador} />
                  <Text style={styles.bancaLabel}>Composição da Mesa de Júri</Text>

                  <View style={styles.membro}>
                    <Text style={styles.membroCargo}>Presidente</Text>
                    <Text style={styles.membroNome}>{mesa.presidente}</Text>
                  </View>

                  <View style={styles.membro}>
                    <Text style={styles.membroCargo}>1.º Vogal</Text>
                    <Text style={styles.membroNome}>{mesa.primeiro_vogal}</Text>
                  </View>

                  <View style={styles.membro}>
                    <Text style={styles.membroCargo}>2.º Vogal (Tutor)</Text>
                    <Text style={styles.membroNome}>{mesa.segundo_vogal_tutor}</Text>
                  </View>

                  <View style={styles.membro}>
                    <Text style={styles.membroCargo}>Suplente</Text>
                    <Text style={styles.membroNome}>{mesa.suplente}</Text>
                  </View>

                  <View style={styles.membro}>
                    <Text style={styles.membroCargo}>Secretário</Text>
                    <Text style={styles.membroNome}>{mesa.secretario}</Text>
                  </View>
                </>
              )}

              {/* Mensagem se ainda não aprovado */}
              {mesa.estado !== 'aprovado' && (
                <View style={styles.aguardaBox}>
                  <Text style={styles.aguardaTexto}>
                    🕐 A composição da mesa de júri ainda está a ser definida pelo departamento.
                    Serás notificado quando estiver disponível.
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))
      )}

      {/* INFORMAÇÕES ÚTEIS */}
      <Text style={styles.seccaoTitulo}>Informações Úteis</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoIcone}>📌</Text>
        <View style={styles.infoTexto}>
          <Text style={styles.infoTitulo}>Como funciona o processo?</Text>
          <Text style={styles.infoDesc}>
            O departamento cria a tua mesa de júri, o agente IA sugere os membros mais adequados ao teu tema, e após aprovação recebes a notificação com todos os detalhes.
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoIcone}>📞</Text>
        <View style={styles.infoTexto}>
          <Text style={styles.infoTitulo}>Precisas de ajuda?</Text>
          <Text style={styles.infoDesc}>
            Contacta o departamento académico da Universidade Kimpa Vita para mais informações sobre o teu processo de defesa.
          </Text>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: {
    backgroundColor: '#F4A623',
    padding: 24,
    paddingTop: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bemVindo: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  nome: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  perfil: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  botaoLogout: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoLogoutTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  seccaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  semBanca: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
  },
  semBancaIcone: { fontSize: 48, marginBottom: 12 },
  semBancaTitulo: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  semBancaTexto: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  bancaCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  estadoBarra: { padding: 12, alignItems: 'center' },
  estadoTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  bancaConteudo: { padding: 16 },
  bancaLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 12, marginBottom: 2 },
  bancaTema: { fontSize: 15, fontWeight: '600', color: '#1F2937', lineHeight: 22 },
  bancaValor: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  separador: { height: 1, backgroundColor: '#F3F4F6', marginTop: 16, marginBottom: 4 },
  membro: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  membroCargo: { fontSize: 11, color: '#9CA3AF', marginBottom: 2 },
  membroNome: { fontSize: 14, color: '#1F2937', fontWeight: '600' },
  aguardaBox: {
    backgroundColor: '#FEF3DC',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  aguardaTexto: { fontSize: 13, color: '#854F0B', lineHeight: 18 },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
  },
  infoIcone: { fontSize: 24, marginRight: 12 },
  infoTexto: { flex: 1 },
  infoTitulo: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  infoDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
});