import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { listarMesas } from '../../services/api';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocenteBancas() {
  const { utilizador } = useAuth();
  const [bancas, setBancas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregarBancas(); }, []);

  const carregarBancas = async () => {
    try {
      const resposta = await listarMesas();
      const minhasBancas = resposta.data.mesas.filter(m =>
        m.presidente === utilizador?.nome ||
        m.primeiro_vogal === utilizador?.nome ||
        m.suplente === utilizador?.nome ||
        m.segundo_vogal_tutor === utilizador?.nome ||
        m.secretario === utilizador?.nome
      );
      setBancas(minhasBancas);
    } catch (erro) {
      toast.error('Erro ao carregar bancas.');
    } finally {
      setCarregando(false);
    }
  };

  const meuCargo = (mesa) => {
    if (mesa.presidente === utilizador?.nome) return 'Presidente';
    if (mesa.primeiro_vogal === utilizador?.nome) return '1.º Vogal';
    if (mesa.segundo_vogal_tutor === utilizador?.nome) return '2.º Vogal (Tutor)';
    if (mesa.suplente === utilizador?.nome) return 'Suplente';
    if (mesa.secretario === utilizador?.nome) return 'Secretário';
    return '—';
  };

  const estadoBadge = (estado) => {
    const map = { aprovado: 'badge-green', sugerido: 'badge-amber', rascunho: 'badge-gray' };
    const textos = { aprovado: 'Aprovada', sugerido: 'Em análise', rascunho: 'Rascunho' };
    return <span className={map[estado] || 'badge-gray'}>{textos[estado] || estado}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">As minhas bancas</h1>
          <p className="text-gray-500 text-sm mt-1">Bancas de defesa em que participas como membro do júri</p>
        </div>

        {carregando ? (
          <div className="card p-12 text-center text-gray-400">A carregar...</div>
        ) : bancas.length === 0 ? (
          <div className="card p-16 text-center">
            <FileText size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sem bancas atribuídas</h3>
            <p className="text-gray-500 text-sm">Ainda não participas em nenhuma banca de defesa.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bancas.map((mesa) => (
              <div key={mesa.id} className="card p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{mesa.nome_estudante}</h3>
                    <p className="text-sm text-gray-500 mt-1">{mesa.tema}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="badge-blue">{meuCargo(mesa)}</span>
                    {estadoBadge(mesa.estado)}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Curso</p>
                    <p className="text-sm text-gray-700 font-medium">{mesa.curso}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Ano</p>
                    <p className="text-sm text-gray-700 font-medium">{mesa.ano}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Data</p>
                    <p className="text-sm text-gray-700 font-medium">
                      {mesa.data_defesa ? new Date(mesa.data_defesa).toLocaleDateString('pt-PT') : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Local</p>
                    <p className="text-sm text-gray-700 font-medium">{mesa.local_defesa || '—'}</p>
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