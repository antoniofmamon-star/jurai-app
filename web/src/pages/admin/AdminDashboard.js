import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import {
  FileText, Users, Clock, CheckCircle,
  Plus, Bot, TrendingUp, AlertCircle
} from 'lucide-react';
import { listarMesas, listarUtilizadores, listarPendentes } from '../../services/api';

export default function AdminDashboard() {
  const { utilizador } = useAuth();
  const [stats, setStats] = useState({
    totalMesas: 0, aprovadas: 0, emAnalise: 0,
    rascunhos: 0, totalUsers: 0, pendentes: 0
  });
  const [mesasRecentes, setMesasRecentes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resMesas, resUsers, resPendentes] = await Promise.all([
        listarMesas(), listarUtilizadores(), listarPendentes()
      ]);
      const mesas = resMesas.data.mesas;
      setStats({
        totalMesas: mesas.length,
        aprovadas: mesas.filter(m => m.estado === 'aprovado').length,
        emAnalise: mesas.filter(m => m.estado === 'sugerido').length,
        rascunhos: mesas.filter(m => m.estado === 'rascunho').length,
        totalUsers: resUsers.data.total,
        pendentes: resPendentes.data.total
      });
      setMesasRecentes(mesas.slice(0, 5));
    } catch (erro) {
      console.error(erro);
    } finally {
      setCarregando(false);
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

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {saudacao}, {utilizador?.nome?.split(' ')[0]}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · UNIKIVI
            </p>
          </div>
          <Link to="/admin/bancas/criar" className="btn-gold">
            <Plus size={16} />
            Nova banca
          </Link>
        </div>

        {/* ALERTA PENDENTES */}
        {stats.pendentes > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
              <p className="text-amber-800 text-sm">
                Tens <strong>{stats.pendentes}</strong> pedido(s) de registo a aguardar aprovação.
              </p>
            </div>
            <Link to="/admin/pendentes" className="text-amber-700 text-sm font-medium hover:underline">
              Ver pedidos →
            </Link>
          </div>
        )}

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total de bancas', valor: stats.totalMesas, icon: FileText, cor: 'bg-blue-50', corIcon: 'text-blue-600', trend: true },
            { label: 'Aprovadas', valor: stats.aprovadas, icon: CheckCircle, cor: 'bg-green-50', corIcon: 'text-green-600', trend: true },
            { label: 'Em análise', valor: stats.emAnalise, icon: Clock, cor: 'bg-amber-50', corIcon: 'text-amber-600' },
            { label: 'Utilizadores', valor: stats.totalUsers, icon: Users, cor: 'bg-purple-50', corIcon: 'text-purple-600' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-5">
                <div className={`w-10 h-10 ${s.cor} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={20} className={s.corIcon} />
                </div>
                <div className="text-2xl font-semibold text-gray-900">{carregando ? '—' : s.valor}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                {s.trend && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs">
                    <TrendingUp size={12} />
                    <span>Em crescimento</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* TABELA DE BANCAS */}
          <div className="lg:col-span-2 card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Bancas recentes</h2>
              <Link to="/admin/bancas" className="text-primary-700 text-sm hover:underline">
                Ver todas →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {carregando ? (
                <div className="p-8 text-center text-gray-400 text-sm">A carregar...</div>
              ) : mesasRecentes.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Ainda não há bancas criadas.</p>
                  <Link to="/admin/bancas/criar" className="text-primary-700 text-sm hover:underline mt-1 inline-block">
                    Criar primeira banca →
                  </Link>
                </div>
              ) : (
                mesasRecentes.map((mesa) => (
                  <Link
                    key={mesa.id}
                    to={`/admin/bancas/${mesa.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 text-xs font-semibold">
                        {mesa.nome_estudante?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{mesa.nome_estudante}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{mesa.tema}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-gray-400 hidden sm:block">{mesa.curso}</span>
                      {estadoBadge(mesa.estado)}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* ACÇÕES RÁPIDAS + CHAT IA */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Acções rápidas</h3>
              <div className="space-y-2">
                {[
                  { label: 'Nova banca de júri', desc: 'Criar e submeter à IA', path: '/admin/bancas/criar', icon: Plus, cor: 'bg-blue-50 text-blue-600' },
                  { label: 'Pedidos pendentes', desc: `${stats.pendentes} a aguardar`, path: '/admin/pendentes', icon: Clock, cor: 'bg-amber-50 text-amber-600' },
                  { label: 'Agente IA', desc: 'Chat e sugestões', path: '/admin/ia', icon: Bot, cor: 'bg-green-50 text-green-600' },
                  { label: 'Utilizadores', desc: 'Gerir contas', path: '/admin/utilizadores', icon: Users, cor: 'bg-purple-50 text-purple-600' },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <Link
                      key={a.path}
                      to={a.path}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-8 h-8 ${a.cor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{a.label}</p>
                        <p className="text-xs text-gray-400">{a.desc}</p>
                      </div>
                      <span className="text-gray-300 group-hover:text-gray-500 text-lg">›</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}