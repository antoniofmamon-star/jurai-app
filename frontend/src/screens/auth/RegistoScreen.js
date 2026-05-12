import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { registar } from '../../services/api';

const perfis = ['estudante', 'docente'];

export default function RegistoScreen({ navigation }) {
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmarPassword: '',
    perfil: 'estudante'
  });

  const actualizar = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const handleRegistar = async () => {
    if (!dados.nome) {
      Alert.alert('Erro', 'Por favor introduz o teu nome completo.');
      return;
    }
    if (!dados.email && !dados.telefone) {
      Alert.alert('Erro', 'Introduz o teu email ou número de telefone.');
      return;
    }
    if (!dados.password) {
      Alert.alert('Erro', 'Introduz uma palavra-passe.');
      return;
    }
    if (dados.password !== dados.confirmarPassword) {
      Alert.alert('Erro', 'As palavras-passe não coincidem.');
      return;
    }
    if (dados.password.length < 6) {
      Alert.alert('Erro', 'A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await registar({
        nome: dados.nome,
        email: dados.email || undefined,
        telefone: dados.telefone || undefined,
        password: dados.password,
        perfil: dados.perfil
      });

      Alert.alert(
        '✅ Registo enviado!',
        resposta.data.mensagem,
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (erro) {
      Alert.alert('Erro', erro.response?.data?.mensagem || 'Erro ao registar. Tenta novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
            <Text style={styles.voltarTexto}>‹ Voltar</Text>
          </TouchableOpacity>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>J</Text>
          </View>
          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.subtitulo}>UNIKIVI — Universidade Kimpa Vita</Text>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.formulario}>

          {/* PERFIL */}
          <Text style={styles.label}>Sou um...</Text>
          <View style={styles.perfilContainer}>
            {perfis.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.perfilBotao, dados.perfil === p && styles.perfilBotaoActivo]}
                onPress={() => actualizar('perfil', p)}
              >
                <Text style={styles.perfilIcone}>
                  {p === 'estudante' ? '🎓' : '👨‍🏫'}
                </Text>
                <Text style={[styles.perfilTexto, dados.perfil === p && styles.perfilTextoActivo]}>
                  {p === 'estudante' ? 'Estudante' : 'Docente'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* NOME */}
          <Text style={styles.label}>Nome completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="O teu nome completo"
            placeholderTextColor="#999"
            value={dados.nome}
            onChangeText={(v) => actualizar('nome', v)}
          />

          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="nome@unikivi.ao"
            placeholderTextColor="#999"
            value={dados.email}
            onChangeText={(v) => actualizar('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.ou}>
            <View style={styles.ouLinha} />
            <Text style={styles.ouTexto}>ou</Text>
            <View style={styles.ouLinha} />
          </View>

          {/* TELEFONE */}
          <Text style={styles.label}>Número de telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 923000000"
            placeholderTextColor="#999"
            value={dados.telefone}
            onChangeText={(v) => actualizar('telefone', v)}
            keyboardType="phone-pad"
          />

          {/* PASSWORD */}
          <Text style={styles.label}>Palavra-passe *</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#999"
            value={dados.password}
            onChangeText={(v) => actualizar('password', v)}
            secureTextEntry
          />

          {/* CONFIRMAR PASSWORD */}
          <Text style={styles.label}>Confirmar palavra-passe *</Text>
          <TextInput
            style={styles.input}
            placeholder="Repete a palavra-passe"
            placeholderTextColor="#999"
            value={dados.confirmarPassword}
            onChangeText={(v) => actualizar('confirmarPassword', v)}
            secureTextEntry
          />

          {/* NOTA */}
          <View style={styles.nota}>
            <Text style={styles.notaTexto}>
              ℹ️ Após o registo, a tua conta ficará pendente até ser aprovada pelo administrador. Receberás uma notificação quando for aprovada.
            </Text>
          </View>

          {/* BOTÃO */}
          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesactivado]}
            onPress={handleRegistar}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.botaoTexto}>Enviar pedido de registo</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Já tens conta? Entra aqui</Text>
          </TouchableOpacity>

        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  cabecalho: {
    backgroundColor: '#0F2952',
    padding: 24,
    paddingTop: 56,
    alignItems: 'center',
  },
  voltar: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  voltarTexto: {
    color: '#A8C4E0',
    fontSize: 16,
  },
  logoBox: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titulo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  formulario: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  perfilContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  perfilBotao: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  perfilBotaoActivo: {
    backgroundColor: '#EEF4FF',
    borderColor: '#0F2952',
    borderWidth: 2,
  },
  perfilIcone: { fontSize: 28 },
  perfilTexto: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  perfilTextoActivo: {
    color: '#0F2952',
    fontWeight: 'bold',
  },
  ou: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 10,
  },
  ouLinha: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  ouTexto: { fontSize: 12, color: '#9CA3AF' },
  nota: {
    backgroundColor: '#EEF4FF',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
  },
  notaTexto: {
    fontSize: 13,
    color: '#0F2952',
    lineHeight: 19,
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
  loginLink: {
    textAlign: 'center',
    color: '#0F2952',
    fontSize: 14,
    marginTop: 16,
    fontWeight: '500',
  },
});