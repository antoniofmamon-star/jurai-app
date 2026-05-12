import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginAPI, euPerfil } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [utilizador, setUtilizador] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Verificar se há sessão guardada ao abrir a app
  useEffect(() => {
    verificarSessao();
  }, []);

  const verificarSessao = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const resposta = await euPerfil();
        setUtilizador(resposta.data.utilizador);
      }
    } catch (erro) {
      await AsyncStorage.removeItem('token');
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email, password) => {
    try {
      const resposta = await loginAPI(email, password);
      const { token, utilizador } = resposta.data;

      // Guardar token
      await AsyncStorage.setItem('token', token);
      setUtilizador(utilizador);

      return { sucesso: true };
    } catch (erro) {
      const mensagem = erro.response?.data?.mensagem || 'Erro ao fazer login.';
      return { sucesso: false, mensagem };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUtilizador(null);
  };

  return (
    <AuthContext.Provider value={{ utilizador, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);