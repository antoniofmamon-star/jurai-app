import axios from 'axios';

const BASE_URL = 'https://jurai-backend-kz61.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Adiciona o token JWT automaticamente em cada pedido
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (erro) => Promise.reject(erro)
);

// Se o token expirar, redireciona para o login
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('utilizador');
      window.location.href = '/login';
    }
    return Promise.reject(erro);
  }
);

// ── AUTENTICAÇÃO ──
export const login = (dados) => api.post('/auth/login', dados);
export const registar = (dados) => api.post('/auth/registar', dados);
export const euPerfil = () => api.get('/auth/eu');

// ── MESAS ──
export const listarMesas = () => api.get('/mesas');
export const verMesa = (id) => api.get(`/mesas/${id}`);
export const criarMesa = (dados) => api.post('/mesas', dados);
export const editarMesa = (id, dados) => api.put(`/mesas/${id}`, dados);
export const aprovarMesa = (id) => api.post(`/mesas/${id}/aprovar`);
export const eliminarMesa = (id) => api.delete(`/mesas/${id}`);

// ── AGENTE IA ──
export const sugerirJuri = (id) => api.post(`/ia/sugerir-juri/${id}`);
export const chatIA = (mensagem, contexto) => api.post('/ia/chat', { mensagem, contexto });
export const gerarDespacho = (id) => api.post(`/ia/gerar-despacho/${id}`);

// ── UTILIZADORES ──
export const listarUtilizadores = () => api.get('/users');
export const listarPendentes = () => api.get('/users/pendentes');
export const listarDocentes = () => api.get('/users/docentes');
export const aprovarRegisto = (id) => api.put(`/users/${id}/aprovar`);
export const rejeitarRegisto = (id) => api.delete(`/users/${id}/rejeitar`);
export const alterarStatusUser = (id) => api.put(`/users/${id}/status`);
export const eliminarUser = (id) => api.delete(`/users/${id}`);

// ── CURRÍCULO ──
export const verCurriculo = () => api.get('/curriculo/meu');
export const verCurriculoDocente = (id) => api.get(`/curriculo/${id}`);
export const adicionarFormacao = (dados) => api.post('/curriculo/formacao', dados);
export const eliminarFormacao = (id) => api.delete(`/curriculo/formacao/${id}`);
export const adicionarPublicacao = (dados) => api.post('/curriculo/publicacao', dados);
export const eliminarPublicacao = (id) => api.delete(`/curriculo/publicacao/${id}`);
export const adicionarLivro = (dados) => api.post('/curriculo/livro', dados);
export const eliminarLivro = (id) => api.delete(`/curriculo/livro/${id}`);
export const adicionarPremio = (dados) => api.post('/curriculo/premio', dados);
export const eliminarPremio = (id) => api.delete(`/curriculo/premio/${id}`);
export const adicionarProjeto = (dados) => api.post('/curriculo/projeto', dados);
export const eliminarProjeto = (id) => api.delete(`/curriculo/projeto/${id}`);
export const adicionarCitacao = (dados) => api.post('/curriculo/citacao', dados);
export const eliminarCitacao = (id) => api.delete(`/curriculo/citacao/${id}`);

export default api;