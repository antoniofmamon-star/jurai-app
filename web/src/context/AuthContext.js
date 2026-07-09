import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI, euPerfil } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [utilizador, setUtilizador] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    verificarSessao();
  }, []);

  const verificarSessao = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const resposta = await euPerfil();
        setUtilizador(resposta.data.utilizador);
      }
    } catch (erro) {
      localStorage.removeItem('token');
      localStorage.removeItem('utilizador');
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email, password) => {
    try {
      const resposta = await loginAPI({ email, password });
      const { token, utilizador } = resposta.data;
      localStorage.setItem('token', token);
      localStorage.setItem('utilizador', JSON.stringify(utilizador));
      setUtilizador(utilizador);
      return { sucesso: true, perfil: utilizador.perfil };
    } catch (erro) {
      const mensagem = erro.response?.data?.mensagem || 'Erro ao fazer login.';
      return { sucesso: false, mensagem };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilizador');
    setUtilizador(null);
  };

  return (
    <AuthContext.Provider value={{ utilizador, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);