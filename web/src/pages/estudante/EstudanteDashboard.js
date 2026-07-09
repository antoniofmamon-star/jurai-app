import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { listarMesas } from '../../services/api';
import { CheckCircle, Clock, FileText, MapPin, Calendar } from 'lucide-react';

export default function EstudanteDashboard() {
  const { utilizador } = useAuth();
  const [mesa, setMesa] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregarMesa(); }, []);

  const carregarMesa = async () => {
    try {
      const resposta = await listarMesas();
      const minhaMesa = resposta.data.mesas.find(m =>
        m.nome_estudante?.toLowerCase().includes(utilizador?.nome?.toLowerCase())
      );
      setMesa(minhaMesa || null);
    } catch (erro) {
      console.error(erro);
    } finally {
      setCarregando(false);
    }
  };

  const timeline = mesa ? [
    { label: 'Processo iniciado', sub: 'Mesa de júri criada pelo departamento', feito: true, data: mesa.createdAt },
    { label: 'Júri sugerido pela IA', sub: 'Agente IA sugeriu os membros da mesa', feito: mesa.estado !== 'rascunho', data: null },
    { label: 'Mesa aprovada', sub: 'Departamento aprovou a composição', feito: mesa.estado === 'aprovado', data: null },
    { label: 'Defesa agendada', sub: 'A tua defesa está agendada', feito: !!mesa.data_defesa && mesa.estado === 'aprovado', data: mesa.data_defesa },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* CABEÇALHO */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Olá, {utilizador?.nome?.split(' ')[0]}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Acompanha o estado do teu processo de defesa</p>
          </div>
          {mesa && (
            <span className={`text-sm px-4 py-2 rounded-full font-medium ${
              mesa.estado === 'aprovado' ? 'bg-green-100 text-green-700' :
              mesa.estado === 'sugerido' ? 'bg-amber-100 text-amber-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {mesa.estado === 'aprovado' ? '✅ Banca aprovada' :
               mesa.estado === 'sugerido' ? '⏳ Em análise' : '📝 Em preparação'}
            </span>
          )}
        </div>

        {carregando ? (
          <div className="card p-12 text-center text-gray-400">A carregar...</div>
        ) : !mesa ? (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ainda sem banca agendada</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Quando a tua mesa de júri for constituída pelo departamento, aparecerá aqui com todos os detalhes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* COLUNA PRINCIPAL */}
            <div className="lg:col-span-2 space-y-6">

              {/* DADOS DA DEFESA */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
                  Dados da minha defesa
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tema</p>
                    <p className="text-sm font-medium text-gray-800">{mesa.tema}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Curso</p>
                      <p className="text-sm text-gray-800">{mesa.curso}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ano</p>
                      <p className="text-sm text-gray-800">{mesa.ano}</p>
                    </div>
                  </div>
                  {mesa.data_defesa && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Data</p>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(mesa.data_defesa).toLocaleDateString('pt-PT')} às {mesa.hora_defesa}
                          </p>
                        </div>
                      </div>
                      {mesa.local_defesa && (
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400">Local</p>
                            <p className="text-sm font-medium text-gray-800">{mesa.local_defesa}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* COMPOSIÇÃO DA MESA */}
              {mesa.estado === 'aprovado' && (
                <div className="card p-6">
                  <h2 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                    Composição da mesa de júri
                  </h2>
                  <div className="space-y-3">
                    {[
                      { cargo: 'Presidente', nome: mesa.presidente },
                      { cargo: '1.º Vogal', nome: mesa.primeiro_vogal },
                      { cargo: '2.º Vogal (Tutor)', nome: mesa.segundo_vogal_tutor },
                      { cargo: 'Suplente', nome: mesa.suplente },
                      { cargo: 'Secretário', nome: mesa.secretario },
                    ].map((m) => (
                      <div key={m.cargo} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">{m.cargo}</p>
                          <p className="text-sm font-medium text-gray-800">{m.nome}</p>
                        </div>
                        <span className="badge-blue">{m.cargo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AGUARDA */}
              {mesa.estado !== 'aprovado' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 mb-1">Mesa em análise</p>
                      <p className="text-sm text-amber-700">
                        A composição da mesa de júri está a ser definida pelo departamento. Serás notificado quando estiver disponível.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TIMELINE */}
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-5">Estado do processo</h3>
                <div className="space-y-4">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        item.feito ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {item.feito
                          ? <CheckCircle size={14} className="text-green-600" />
                          : <Clock size={14} className="text-gray-400" />
                        }
                      </div>
                      <div className="flex-1 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <p className={`text-sm font-medium ${item.feito ? 'text-gray-900' : 'text-gray-400'}`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                        {item.data && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(item.data).toLocaleDateString('pt-PT')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Informação útil</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  O departamento cria a tua mesa de júri, o agente IA sugere os membros mais adequados ao teu tema, e após aprovação recebes todos os detalhes aqui.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}