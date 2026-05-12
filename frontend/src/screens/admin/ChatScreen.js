import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { chatIA } from '../../services/api';

export default function ChatScreen({ navigation }) {
  const [mensagens, setMensagens] = useState([
    {
      id: '1',
      tipo: 'ia',
      texto: 'Olá! Sou o assistente do Sistema JURAI da Universidade Kimpa Vita. Como posso ajudar-te hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const listaRef = useRef(null);

  const enviarMensagem = async () => {
    if (!input.trim() || carregando) return;

    const mensagemUtilizador = {
      id: Date.now().toString(),
      tipo: 'utilizador',
      texto: input.trim()
    };

    setMensagens(prev => [...prev, mensagemUtilizador]);
    setInput('');
    setCarregando(true);

    try {
      const resposta = await chatIA(input.trim());

      const mensagemIA = {
        id: (Date.now() + 1).toString(),
        tipo: 'ia',
        texto: resposta.data.resposta
      };

      setMensagens(prev => [...prev, mensagemIA]);
    } catch (erro) {
      const mensagemErro = {
        id: (Date.now() + 1).toString(),
        tipo: 'ia',
        texto: 'Desculpa, ocorreu um erro ao processar a tua mensagem. Tenta novamente.'
      };
      setMensagens(prev => [...prev, mensagemErro]);
    } finally {
      setCarregando(false);
      setTimeout(() => listaRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMensagem = ({ item }) => (
    <View style={[
      styles.mensagem,
      item.tipo === 'utilizador' ? styles.mensagemUtilizador : styles.mensagemIA
    ]}>
      {item.tipo === 'ia' && (
        <Text style={styles.iaIcone}>🤖</Text>
      )}
      <View style={[
        styles.balao,
        item.tipo === 'utilizador' ? styles.balaoUtilizador : styles.balaoIA
      ]}>
        <Text style={[
          styles.balaoTexto,
          item.tipo === 'utilizador' ? styles.balaoTextoUtilizador : styles.balaoTextoIA
        ]}>
          {item.texto}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>
        <View style={styles.cabecalhoInfo}>
          <Text style={styles.titulo}>Agente IA</Text>
          <Text style={styles.subtitulo}>Assistente JURAI</Text>
        </View>
        <Text style={styles.iaEmoji}>🤖</Text>
      </View>

      {/* MENSAGENS */}
      <FlatList
        ref={listaRef}
        data={mensagens}
        keyExtractor={(item) => item.id}
        renderItem={renderMensagem}
        contentContainerStyle={styles.lista}
        onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: true })}
      />

      {/* INDICADOR DE ESCRITA */}
      {carregando && (
        <View style={styles.escrevendo}>
          <Text style={styles.escrevendoTexto}>🤖 O agente está a escrever...</Text>
          <ActivityIndicator size="small" color="#1B3A6B" />
        </View>
      )}

      {/* INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escreve uma mensagem..."
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.botaoEnviar, (!input.trim() || carregando) && styles.botaoDesactivado]}
            onPress={enviarMensagem}
            disabled={!input.trim() || carregando}
          >
            <Text style={styles.botaoEnviarTexto}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  cabecalho: {
    backgroundColor: '#1B3A6B',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  voltar: { color: '#A8C4E0', fontSize: 16, width: 60 },
  cabecalhoInfo: { flex: 1, alignItems: 'center' },
  titulo: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  subtitulo: { color: '#A8C4E0', fontSize: 12 },
  iaEmoji: { fontSize: 28, width: 60, textAlign: 'right' },
  lista: { padding: 16 },
  mensagem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  mensagemUtilizador: { justifyContent: 'flex-end' },
  mensagemIA: { justifyContent: 'flex-start' },
  iaIcone: { fontSize: 20, marginRight: 8, marginBottom: 4 },
  balao: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  balaoUtilizador: {
    backgroundColor: '#1B3A6B',
    borderBottomRightRadius: 4,
  },
  balaoIA: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balaoTexto: { fontSize: 14, lineHeight: 20 },
  balaoTextoUtilizador: { color: '#FFFFFF' },
  balaoTextoIA: { color: '#1F2937' },
  escrevendo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  escrevendoTexto: { fontSize: 13, color: '#6B7280', fontStyle: 'italic' },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    color: '#333',
  },
  botaoEnviar: {
    backgroundColor: '#1B3A6B',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoDesactivado: { backgroundColor: '#9CA3AF' },
  botaoEnviarTexto: { color: '#FFFFFF', fontSize: 18 },
});