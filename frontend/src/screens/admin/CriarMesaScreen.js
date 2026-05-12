import React, { useState } from 'react';
import {
  View, Text, StyleSheet,
  TextInput, TouchableOpacity, ActivityIndicator, Alert,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { criarMesa } from '../../services/api';

export default function CriarMesaScreen({ navigation }) {
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState({
    nome_estudante: '',
    tema: '',
    curso: '',
    ano: '',
    data_defesa: '',
    hora_defesa: '',
    local_defesa: '',
    segundo_vogal_tutor: '',
    secretario: '',
  });

  const actualizar = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const handleCriar = async () => {
    if (!dados.nome_estudante || !dados.tema || !dados.curso ||
        !dados.ano || !dados.segundo_vogal_tutor || !dados.secretario) {
      Alert.alert('Erro', 'Por favor preenche todos os campos obrigatórios.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await criarMesa(dados);
      const mesa = resposta.data.mesa;

      Alert.alert(
        'Mesa criada!',
        'A mesa foi criada com sucesso. Queres que a IA sugira os membros do júri agora?',
        [
          { text: 'Depois', onPress: () => navigation.navigate('ListaMesas') },
          { text: 'Sim, sugerir agora', onPress: () => navigation.navigate('DetalhesMesa', { mesaId: mesa.id }) }
        ]
      );
    } catch (erro) {
      Alert.alert('Erro', erro.response?.data?.mensagem || 'Erro ao criar mesa.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* CABEÇALHO FIXO */}
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Nova Mesa de Júri</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* SCROLL COM TECLADO */}
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollConteudo}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* DADOS DO ESTUDANTE */}
        <Text style={styles.seccao}>Dados do Estudante</Text>

        <Text style={styles.label}>Nome do Estudante *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome completo do estudante"
          value={dados.nome_estudante}
          onChangeText={(v) => actualizar('nome_estudante', v)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Tema da Defesa *</Text>
        <TextInput
          style={[styles.input, styles.inputMultilinha]}
          placeholder="Título completo do trabalho"
          value={dados.tema}
          onChangeText={(v) => actualizar('tema', v)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Curso *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Engenharia Informática"
          value={dados.curso}
          onChangeText={(v) => actualizar('curso', v)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Ano *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 4.º Ano"
          value={dados.ano}
          onChangeText={(v) => actualizar('ano', v)}
          returnKeyType="next"
        />

        {/* DADOS DA DEFESA */}
        <Text style={styles.seccao}>Dados da Defesa</Text>

        <Text style={styles.label}>Data da Defesa</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 2026-06-15"
          value={dados.data_defesa}
          onChangeText={(v) => actualizar('data_defesa', v)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Hora</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 10:00"
          value={dados.hora_defesa}
          onChangeText={(v) => actualizar('hora_defesa', v)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Local</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Sala de Actos"
          value={dados.local_defesa}
          onChangeText={(v) => actualizar('local_defesa', v)}
          returnKeyType="next"
        />

        {/* MEMBROS CONHECIDOS */}
        <Text style={styles.seccao}>Membros Conhecidos</Text>

        <Text style={styles.label}>2.º Vogal — Tutor/Orientador *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome completo do tutor"
          value={dados.segundo_vogal_tutor}
          onChangeText={(v) => actualizar('segundo_vogal_tutor', v)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Secretário *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome completo do secretário"
          value={dados.secretario}
          onChangeText={(v) => actualizar('secretario', v)}
          returnKeyType="done"
        />

        <View style={styles.nota}>
          <Text style={styles.notaTexto}>
            💡 O Presidente, 1.º Vogal e Suplente serão sugeridos pelo Agente IA após criar a mesa.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesactivado]}
          onPress={handleCriar}
          disabled={carregando}
        >
          {carregando
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botaoTexto}>Criar Mesa de Júri</Text>
          }
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  cabecalho: {
    backgroundColor: '#0F2952',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voltar: { color: '#A8C4E0', fontSize: 16, width: 60 },
  titulo: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  scroll: { flex: 1 },
  scrollConteudo: { padding: 16, paddingBottom: 60 },
  seccao: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F2952',
    marginTop: 24,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  inputMultilinha: {
    height: 90,
    textAlignVertical: 'top',
  },
  nota: {
    backgroundColor: '#EEF4FF',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
  },
  notaTexto: {
    fontSize: 13,
    color: '#0F2952',
    lineHeight: 19,
  },
  botao: {
    backgroundColor: '#0F2952',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoDesactivado: { backgroundColor: '#9CA3AF' },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});