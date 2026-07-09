import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { verMesa, sugerirJuri, aprovarMesa, gerarDespacho } from '../../services/api';
import { ArrowLeft, Bot, CheckCircle, FileText, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDetalhesBanca() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mesa, setMesa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [carregandoAprovacao, setCarregandoAprovacao] = useState(false);
  const [carregandoDespacho, setCarregandoDespacho] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(function () {
    carregarMesa();
  }, [id]);

  function carregarMesa() {
    verMesa(id)
      .then(function (resposta) {
        setMesa(resposta.data.mesa);
      })
      .catch(function () {
        toast.error('Erro ao carregar banca.');
        navigate('/admin/bancas');
      })
      .finally(function () {
        setCarregando(false);
      });
  }

  function handleSugerirJuri() {
    setCarregandoIA(true);
    sugerirJuri(id)
      .then(function (resposta) {
        setMesa(resposta.data.mesa);
        toast.success('Sugestão gerada com sucesso!');
      })
      .catch(function (erro) {
        var msg = (erro.response && erro.response.data && erro.response.data.mensagem) || 'Erro ao gerar sugestão.';
        toast.error(msg);
      })
      .finally(function () {
        setCarregandoIA(false);
      });
  }

  function handleAprovar() {
    var confirmado = window.confirm('Confirmas a aprovação desta mesa de júri?');
    if (!confirmado) return;
    setCarregandoAprovacao(true);
    aprovarMesa(id)
      .then(function (resposta) {
        setMesa(resposta.data.mesa);
        toast.success('Mesa aprovada com sucesso!');
      })
      .catch(function (erro) {
        var msg = (erro.response && erro.response.data && erro.response.data.mensagem) || 'Erro ao aprovar.';
        toast.error(msg);
      })
      .finally(function () {
        setCarregandoAprovacao(false);
      });
  }

  function handleGerarDespacho() {
    setCarregandoDespacho(true);
    gerarDespacho(id)
      .then(function (resposta) {
        toast.success('Despacho gerado com sucesso!');
        setPdfUrl(resposta.data.pdf.url);
      })
      .catch(function (erro) {
        var msg = (erro.response && erro.response.data && erro.response.data.mensagem) || 'Erro ao gerar despacho.';
        toast.error(msg);
      })
      .finally(function () {
        setCarregandoDespacho(false);
      });
  }

  function estadoBadge(estado) {
    var classes = {
      aprovado: 'badge-green',
      sugerido: 'badge-amber',
      rascunho: 'badge-gray',
      rejeitado: 'badge-red'
    };
    var textos = {
      aprovado: 'Aprovada',
      sugerido: 'Em análise',
      rascunho: 'Rascunho',
      rejeitado: 'Rejeitada'
    };
    var classe = classes[estado] || 'badge-gray';
    var texto = textos[estado] || estado;
    return <span className={classe + ' text-sm px-3 py-1'}>{texto}</span>;
  }

  var aguardaIA = mesa && mesa.presidente === 'Aguardando sugestão da IA';
  var linkPDF = pdfUrl ? 'http://localhost:3000' + pdfUrl : '';

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-primary-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={function () { navigate('/admin/bancas'); }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{mesa ? mesa.nome_estudante : ''}</h1>
              <p className="text-gray-500 text-sm mt-1">{mesa ? mesa.curso : ''} · {mesa ? mesa.ano : ''}</p>
            </div>
          </div>
          {mesa ? estadoBadge(mesa.estado) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Dados da defesa
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tema</p>
                  <p className="text-sm text-gray-800 font-medium">{mesa ? mesa.tema : ''}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Curso</p>
                    <p className="text-sm text-gray-800">{mesa ? mesa.curso : ''}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ano</p>
                    <p className="text-sm text-gray-800">{mesa ? mesa.ano : ''}</p>
                  </div>
                  {mesa && mesa.data_defesa ? (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Data</p>
                      <p className="text-sm text-gray-800">
                        {new Date(mesa.data_defesa).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  ) : null}
                  {mesa && mesa.data_defesa ? (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Hora</p>
                      <p className="text-sm text-gray-800">{mesa.hora_defesa || '—'}</p>
                    </div>
                  ) : null}
                  {mesa && mesa.local_defesa ? (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Local</p>
                      <p className="text-sm text-gray-800">{mesa.local_defesa}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Composição da mesa de júri
              </h2>
              <div className="space-y-3">
                {mesa ? [
                  { cargo: 'Presidente', nome: mesa.presidente, ia: true },
                  { cargo: '1.º Vogal', nome: mesa.primeiro_vogal, ia: true },
                  { cargo: '2.º Vogal (Tutor)', nome: mesa.segundo_vogal_tutor, ia: false },
                  { cargo: 'Suplente', nome: mesa.suplente, ia: true },
                  { cargo: 'Secretário', nome: mesa.secretario, ia: false }
                ].map(function (m) {
                  var pendente = m.nome === 'Aguardando sugestão da IA';
                  return (
                    <div key={m.cargo} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{m.cargo}</p>
                        <p className={pendente ? 'text-sm font-medium text-amber-600 italic' : 'text-sm font-medium text-gray-800'}>
                          {pendente ? 'Aguarda sugestão da IA' : m.nome}
                        </p>
                      </div>
                      {m.ia ? <span className="badge-blue text-xs">IA</span> : null}
                    </div>
                  );
                }) : null}
              </div>
            </div>

            {mesa && mesa.justificacao_ia ? (
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Bot size={18} className="text-blue-500" />
                  Justificação do Agente IA
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">{mesa.justificacao_ia}</p>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Acções</h3>
              <div className="space-y-3">

                {mesa && (aguardaIA || mesa.estado === 'sugerido') ? (
                  <button
                    onClick={handleSugerirJuri}
                    disabled={carregandoIA}
                    className="w-full btn-primary justify-center"
                  >
                    {carregandoIA ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Bot size={16} />
                        {aguardaIA ? 'Pedir sugestão à IA' : 'Nova sugestão da IA'}
                      </span>
                    )}
                  </button>
                ) : null}

                {mesa && mesa.estado === 'sugerido' ? (
                  <button
                    onClick={handleAprovar}
                    disabled={carregandoAprovacao}
                    className="w-full btn-gold justify-center"
                  >
                    {carregandoAprovacao ? (
                      <div className="w-4 h-4 border-2 border-primary-900/30 border-t-primary-900 rounded-full animate-spin"></div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        Aprovar mesa
                      </span>
                    )}
                  </button>
                ) : null}

                {mesa && mesa.estado === 'aprovado' ? (
                  <button
                    onClick={handleGerarDespacho}
                    disabled={carregandoDespacho}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {carregandoDespacho ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FileText size={16} />
                        Gerar despacho PDF
                      </span>
                    )}
                  </button>
                ) : null}

                {pdfUrl ? (
                  
                   <a href={linkPDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-gold justify-center"
                  >
                    <FileText size={16} />
                    Abrir despacho PDF
                  </a>
                ) : null}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Informação</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Criada em</span>
                  <span className="text-gray-800 font-medium">
                    {mesa && mesa.createdAt ? new Date(mesa.createdAt).toLocaleDateString('pt-PT') : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado</span>
                  <span className="text-gray-800 font-medium capitalize">{mesa ? mesa.estado : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IA utilizada</span>
                  <span className="text-gray-800 font-medium">
                    {mesa && mesa.justificacao_ia ? 'Sim' : 'Não'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}