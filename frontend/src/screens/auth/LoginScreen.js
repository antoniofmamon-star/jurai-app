import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor preenche o email e a palavra-passe.');
      return;
    }

    setCarregando(true);
    const resultado = await login(email, password);
    setCarregando(false);

    if (!resultado.sucesso) {
      Alert.alert('Erro', resultado.mensagem);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* LOGO E CABEÇALHO */}
        <View style={styles.cabecalho}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>J</Text>
          </View>
          <Text style={styles.titulo}>JURAI</Text>
          <Text style={styles.subtitulo}>Sistema de Gestão de Bancas</Text>
          <Text style={styles.universidade}>UNIKIVI — Universidade Kimpa Vita</Text>
          <Text style={styles.lema}>Cientificidade · Inovação · Desenvolvimento</Text>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.formulario}>
          <Text style={styles.formTitulo}>Entrar na conta</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="nome@unikivi.ao"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Palavra-passe</Text>
          <TextInput
            style={styles.input}
            placeholder="A tua palavra-passe"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesactivado]}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.botaoTexto}>Entrar na conta</Text>
            }
          </TouchableOpacity>

          {/* DIVISOR */}
          <View style={styles.divisor}>
            <View style={styles.divisorLinha} />
            <Text style={styles.divisorTexto}>não tens conta?</Text>
            <View style={styles.divisorLinha} />
          </View>

          {/* BOTÃO CRIAR CONTA */}
          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate('Registo')}
          >
            <Text style={styles.botaoSecundarioTexto}>Criar conta nova</Text>
          </TouchableOpacity>

        </View>

        {/* RODAPÉ */}
        <Text style={styles.rodape}>
          Sistema JURAI v1.0 — UNIKIVI · Uíge, Angola
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F2952',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 6,
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  universidade: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  lema: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
  },
  formulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  formTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F2952',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#F9FAFB',
  },
  botao: {
    backgroundColor: '#0F2952',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoDesactivado: { backgroundColor: '#9CA3AF' },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  divisorLinha: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  divisorTexto: { fontSize: 12, color: '#9CA3AF' },
  botaoSecundario: {
    borderWidth: 1.5,
    borderColor: '#0F2952',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  botaoSecundarioTexto: {
    color: '#0F2952',
    fontSize: 15,
    fontWeight: '600',
  },
  rodape: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    marginTop: 24,
  },
});