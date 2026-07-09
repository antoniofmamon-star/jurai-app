import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { listarUtilizadores, alterarStatusUser, eliminarUser } from '../../services/api';
import { Users, Search, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUtilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  useEffect(() => { carregarUtilizadores(); }, []);

  useEffect(() => {
    let resultado = [...utilizadores];
    if (pesquisa) {
      resultado = resultado.filter(u =>
        u.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        u.email?.toLowerCase().includes(pesquisa.toLowerCase())
      );
    }
    if (filtroActivo !== 'Todos') {
      const map = { 'Admin': 'admin', 'Docentes': 'docente', 'Estudantes': 'estudante' };
      resultado = resultado.filter(u => u.perfil === map[filtroActivo]);
    }
    setFiltrados(resultado);
  }, [utilizadores, pesquisa, filtroActivo]);

  const carregarUtilizadores = async () => {
    try {
      const resposta = await listarUtilizadores();
      setUtilizadores(resposta.data.utilizadores);
    } catch (erro) {
      toast.error('Erro ao carregar utilizadores.');
    } finally {
      setCarregando(false);
    }
  };

  const handleAlterarStatus = async (utilizador) => {
    try {
      await alterarStatusUser(utilizador.id);
      toast.success(`Conta ${utilizador.estado === 'activo' ? 'desactivada' : 'activada'}.`);
      carregarUtilizadores();
    } catch (erro) {
      toast.error(erro.response?.data?.mensagem || 'Erro ao alterar estado.');
    }
  };

  const handleEliminar = async (utilizador) => {
    if (!window.confirm(`Eliminar a conta de ${utilizador.nome}?`)) return;
    try {
      await eliminarUser(utilizador.id);
      toast.success('Conta eliminada.');
      carregarUtilizadores();
    } catch (erro) {
      toast.error(erro.response?.data?.mensagem || 'Erro ao eliminar.');
    }
  };

  const perfilBadge = (perfil) => {
    const map = {
      admin: 'badge-gold',
      docente: 'badge-blue',
      estudante: 'badge-green'
    };
    const textos = { admin: 'Admin', docente: 'Docente', estudante: 'Estudante' };
    return <span className={map[perfil]}>{textos[perfil]}</span>;
  };

  const iniciais = (nome) => nome?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Utilizadores</h1>
            <p className="text-gray-500 text-sm mt-1">{utilizadores.length} conta(s) registada(s)</p>
          </div>
        </div>

        {/* FILTROS */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou email..."
                className="input-field pl-9"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
            </div>
            <div className="flex gap-1">
              {['Todos', 'Admin', 'Docentes', 'Estudantes'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroActivo(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filtroActivo === f
                      ? 'bg-primary-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TABELA */}
        <div className="card overflow-hidden">
          {carregando ? (
            <div className="p-12 text-center text-gray-400">A carregar...</div>
          ) : filtrados.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum utilizador encontrado.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Utilizador</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Perfil</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Registado em</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-700 text-xs font-semibold">{iniciais(u.nome)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{u.nome}</p>
                          <p className="text-xs text-gray-500">{u.email || u.telefone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">{perfilBadge(u.perfil)}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">
                        {new Date(u.createdAt).toLocaleDateString('pt-PT')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={u.estado === 'activo' ? 'badge-green' : 'badge-red'}>
                        {u.estado === 'activo' ? 'Activo' : u.estado === 'pendente' ? 'Pendente' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {u.perfil !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleAlterarStatus(u)}
                              className={`p-2 rounded-lg transition-colors ${
                                u.estado === 'activo'
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                              title={u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                            >
                              {u.estado === 'activo' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            </button>
                            <button
                              onClick={() => handleEliminar(u)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}