import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { listarMesas, eliminarMesa } from '../../services/api';
import { Plus, Search, FileText, Trash2, Eye, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const filtros = ['Todas', 'Rascunho', 'Em análise', 'Aprovadas'];

export default function AdminBancas() {
  const [mesas, setMesas] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todas');

  useEffect(() => { carregarMesas(); }, []);

  useEffect(() => {
    let resultado = [...mesas];
    if (pesquisa) {
      resultado = resultado.filter(m =>
        m.nome_estudante?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        m.tema?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        m.curso?.toLowerCase().includes(pesquisa.toLowerCase())
      );
    }
    if (filtroActivo !== 'Todas') {
      const map = { 'Rascunho': 'rascunho', 'Em análise': 'sugerido', 'Aprovadas': 'aprovado' };
      resultado = resultado.filter(m => m.estado === map[filtroActivo]);
    }
    setFiltradas(resultado);
  }, [mesas, pesquisa, filtroActivo]);

  const carregarMesas = async () => {
    try {
      const resposta = await listarMesas();
      setMesas(resposta.data.mesas);
    } catch (erro) {
      toast.error('Erro ao carregar bancas.');
    } finally {
      setCarregando(false);
    }
  };

  const handleEliminar = async (id, nome) => {
    if (!window.confirm(`Eliminar a banca de ${nome}?`)) return;
    try {
      await eliminarMesa(id);
      toast.success('Banca eliminada.');
      carregarMesas();
    } catch (erro) {
      toast.error(erro.response?.data?.mensagem || 'Erro ao eliminar.');
    }
  };

  const estadoBadge = (estado) => {
    const map = {
      aprovado: 'badge-green',
      sugerido: 'badge-amber',
      rascunho: 'badge-gray',
      rejeitado: 'badge-red'
    };
    const textos = {
      aprovado: 'Aprovada',
      sugerido: 'Em análise',
      rascunho: 'Rascunho',
      rejeitado: 'Rejeitada'
    };
    return <span className={map[estado] || 'badge-gray'}>{textos[estado] || estado}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Bancas de júri</h1>
            <p className="text-gray-500 text-sm mt-1">{mesas.length} banca(s) no total</p>
          </div>
          <Link to="/admin/bancas/criar" className="btn-gold">
            <Plus size={16} />
            Nova banca
          </Link>
        </div>

        {/* FILTROS E PESQUISA */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar por estudante, tema ou curso..."
                className="input-field pl-9"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <div className="flex gap-1">
                {filtros.map((f) => (
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
        </div>

        {/* TABELA */}
        <div className="card overflow-hidden">
          {carregando ? (
            <div className="p-12 text-center text-gray-400">A carregar...</div>
          ) : filtradas.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nenhuma banca encontrada</p>
              <p className="text-gray-400 text-sm mt-1">Tenta alterar os filtros ou cria uma nova banca.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estudante</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Curso</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Data</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtradas.map((mesa) => (
                  <tr key={mesa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-700 text-xs font-semibold">
                            {mesa.nome_estudante?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{mesa.nome_estudante}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{mesa.tema}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{mesa.curso}</span>
                      <span className="text-xs text-gray-400 block">{mesa.ano}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">
                        {mesa.data_defesa
                          ? new Date(mesa.data_defesa).toLocaleDateString('pt-PT')
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{estadoBadge(mesa.estado)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/bancas/${mesa.id}`}
                          className="p-2 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </Link>
                        {mesa.estado !== 'aprovado' && (
                          <button
                            onClick={() => handleEliminar(mesa.id, mesa.nome_estudante)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
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