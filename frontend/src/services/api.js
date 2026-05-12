import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL do backend — quando estiveres a testar no telemóvel
// substitui 'localhost' pelo IP do teu computador (ex: 192.168.1.100)
export const BASE_URL = 'http://10.108.233.32:3000/api';

// Criar instância do axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor — adiciona o token JWT automaticamente em cada pedido
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (erro) => Promise.reject(erro)
);

// ── AUTENTICAÇÃO ──
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const registar = (dados) =>
  api.post('/auth/registar', dados);

export const euPerfil = () =>
  api.get('/auth/eu');

// ── MESAS ──
export const listarMesas = () =>
  api.get('/mesas');

export const verMesa = (id) =>
  api.get(`/mesas/${id}`);

export const criarMesa = (dados) =>
  api.post('/mesas', dados);

export const editarMesa = (id, dados) =>
  api.put(`/mesas/${id}`, dados);

export const aprovarMesa = (id) =>
  api.post(`/mesas/${id}/aprovar`);

export const eliminarMesa = (id) =>
  api.delete(`/mesas/${id}`);

// ── AGENTE IA ──
export const sugerirJuri = (id) =>
  api.post(`/ia/sugerir-juri/${id}`);

export const chatIA = (mensagem, contexto) =>
  api.post('/ia/chat', { mensagem, contexto });

export const gerarDespacho = (id) =>
  api.post(`/ia/gerar-despacho/${id}`);

// ── UTILIZADORES ──
export const listarUtilizadores = () =>
  api.get('/users');

export const listarDocentes = () =>
  api.get('/users/docentes');

export const alterarStatusUser = (id) =>
  api.put(`/users/${id}/status`);

export const eliminarUser = (id) =>
  api.delete(`/users/${id}`);

// ── CURRÍCULO ──
export const verCurriculo = () =>
  api.get('/curriculo/meu');

export const adicionarFormacao = (dados) =>
  api.post('/curriculo/formacao', dados);

export const adicionarPublicacao = (dados) =>
  api.post('/curriculo/publicacao', dados);

export const adicionarLivro = (dados) =>
  api.post('/curriculo/livro', dados);

export const adicionarPremio = (dados) =>
  api.post('/curriculo/premio', dados);

export const adicionarProjeto = (dados) =>
  api.post('/curriculo/projeto', dados);

export const adicionarCitacao = (dados) =>
  api.post('/curriculo/citacao', dados);

export default api;