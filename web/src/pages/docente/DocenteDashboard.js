import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { verCurriculo, listarMesas } from '../../services/api';
import { FileText, GraduationCap, BookOpen, Trophy, FlaskConical, Bot } from 'lucide-react';

export default function DocenteDashboard() {
  const { utilizador } = useAuth();
  const [curriculo, setCurriculo] = useState(null);
  const [bancas, setBancas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const [resCurriculo, resMesas] = await Promise.all([
        verCurriculo(),
        listarMesas()
      ]);
      setCurriculo(resCurriculo.data.curriculo);
      const minhasBancas = resMesas.data.mesas.filter(m =>
        m.presidente === utilizador?.nome ||
        m.primeiro_vogal === utilizador?.nome ||
        m.suplente === utilizador?.nome ||
        m.segundo_vogal_tutor === utilizador?.nome ||
        m.secretario === utilizador?.nome
      );
      setBancas(minhasBancas);
    } catch (erro) {
      console.error(erro);
    } finally {
      setCarregando(false);
    }
  };

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  const estadoBadge = (estado) => {
    const map = { aprovado: 'badge-green', sugerido: 'badge-amber', rascunho: 'badge-gray' };
    const textos = { aprovado: 'Aprovada', sugerido: 'Em análise', rascunho: 'Rascunho' };
    return <span className={map[estado] || 'badge-gray'}>{textos[estado] || estado}</span>;
  };

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
            <p className="text-gray-500 text-sm mt-1">Docente · UNIKIVI</p>
          </div>
          <Link to="/docente/curriculo" className="btn-gold">
            <FileText size={16} />
            Actualizar currículo
          </Link>
        </div>

        {/* ESTATÍSTICAS DO CURRÍCULO */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Formações', valor: curriculo?.formacoes?.length || 0, icon: GraduationCap, cor: 'bg-blue-50', corIcon: 'text-blue-600' },
            { label: 'Publicações', valor: curriculo?.publicacoes?.length || 0, icon: BookOpen, cor: 'bg-green-50', corIcon: 'text-green-600' },
            { label: 'Bancas como júri', valor: bancas.length, icon: FileText, cor: 'bg-amber-50', corIcon: 'text-amber-600' },
            { label: 'Prémios', valor: curriculo?.premios?.length || 0, icon: Trophy, cor: 'bg-purple-50', corIcon: 'text-purple-600' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-5">
                <div className={`w-10 h-10 ${s.cor} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={20} className={s.corIcon} />
                </div>
                <div className="text-2xl font-semibold text-gray-900">{carregando ? '—' : s.valor}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* BANCAS */}
          <div className="lg:col-span-2 card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">As minhas bancas</h2>
              <Link to="/docente/bancas" className="text-primary-700 text-sm hover:underline">
                Ver todas →
              </Link>
            </div>
            {carregando ? (
              <div className="p-8 text-center text-gray-400 text-sm">A carregar...</div>
            ) : bancas.length === 0 ? (
              <div className="p-8 text-center">
                <FileText size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Ainda não participas em nenhuma banca.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {bancas.slice(0, 4).map((mesa) => (
                  <div key={mesa.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 text-xs font-semibold">
                        {mesa.nome_estudante?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{mesa.nome_estudante}</p>
                      <p className="text-xs text-gray-500 truncate">{mesa.tema}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {mesa.data_defesa && (
                        <span className="text-xs text-gray-400">
                          {new Date(mesa.data_defesa).toLocaleDateString('pt-PT')}
                        </span>
                      )}
                      {estadoBadge(mesa.estado)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACÇÕES RÁPIDAS */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Acções rápidas</h3>
              <div className="space-y-2">
                {[
                  { label: 'O meu currículo', desc: 'Gerir formação e publicações', path: '/docente/curriculo', icon: GraduationCap, cor: 'bg-blue-50 text-blue-600' },
                  { label: 'As minhas bancas', desc: 'Ver bancas em que participo', path: '/docente/bancas', icon: FileText, cor: 'bg-amber-50 text-amber-600' },
                  { label: 'Projectos', desc: 'Gerir projectos de investigação', path: '/docente/curriculo', icon: FlaskConical, cor: 'bg-green-50 text-green-600' },
                  { label: 'Agente IA', desc: 'Chat com o assistente', path: '/docente/ia', icon: Bot, cor: 'bg-purple-50 text-purple-600' },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <Link
                      key={a.path + a.label}
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