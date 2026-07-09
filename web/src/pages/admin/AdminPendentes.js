import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { listarPendentes, aprovarRegisto, rejeitarRegisto } from '../../services/api';
import { Clock, CheckCircle, XCircle, GraduationCap, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPendentes() {
  const [pendentes, setPendentes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregarPendentes(); }, []);

  const carregarPendentes = async () => {
    try {
      const resposta = await listarPendentes();
      setPendentes(resposta.data.pendentes);
    } catch (erro) {
      toast.error('Erro ao carregar pedidos.');
    } finally {
      setCarregando(false);
    }
  };

  const handleAprovar = async (utilizador) => {
    try {
      await aprovarRegisto(utilizador.id);
      toast.success(`Conta de ${utilizador.nome} aprovada!`);
      carregarPendentes();
    } catch (erro) {
      toast.error('Erro ao aprovar.');
    }
  };

  const handleRejeitar = async (utilizador) => {
    if (!window.confirm(`Rejeitar o pedido de ${utilizador.nome}?`)) return;
    try {
      await rejeitarRegisto(utilizador.id);
      toast.success('Pedido rejeitado.');
      carregarPendentes();
    } catch (erro) {
      toast.error('Erro ao rejeitar.');
    }
  };

  const iniciais = (nome) => nome?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* CABEÇALHO */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Pedidos Pendentes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pendentes.length} pedido(s) a aguardar aprovação
          </p>
        </div>

        {carregando ? (
          <div className="card p-12 text-center text-gray-400">A carregar...</div>
        ) : pendentes.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sem pedidos pendentes</h3>
            <p className="text-gray-500 text-sm">Todos os pedidos de registo foram processados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendentes.map((u) => (
              <div key={u.id} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-semibold">{iniciais(u.nome)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{u.nome}</h3>
                        <span className={`badge-${u.perfil === 'docente' ? 'blue' : 'green'} flex items-center gap-1`}>
                          {u.perfil === 'docente'
                            ? <><BookOpen size={10} /> Docente</>
                            : <><GraduationCap size={10} /> Estudante</>
                          }
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{u.email || u.telefone}</p>
                      <div className="flex items-center gap-1 mt-2 text-amber-600 text-xs">
                        <Clock size={12} />
                        <span>Pedido em {new Date(u.createdAt).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleRejeitar(u)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                    >
                      <XCircle size={15} />
                      Rejeitar
                    </button>
                    <button
                      onClick={() => handleAprovar(u)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <CheckCircle size={15} />
                      Aprovar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}