import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import {
  verCurriculo, adicionarFormacao, eliminarFormacao,
  adicionarPublicacao, eliminarPublicacao,
  adicionarLivro, eliminarLivro,
  adicionarPremio, eliminarPremio,
  adicionarProjeto, eliminarProjeto
} from '../../services/api';
import { Plus, Trash2, GraduationCap, BookOpen, Book, Trophy, FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'formacao', label: 'Formação', icon: GraduationCap },
  { id: 'publicacoes', label: 'Publicações', icon: BookOpen },
  { id: 'livros', label: 'Livros', icon: Book },
  { id: 'premios', label: 'Prémios', icon: Trophy },
  { id: 'projetos', label: 'Projectos', icon: FlaskConical },
];

export default function DocenteCurriculo() {
  const [tabActiva, setTabActiva] = useState('formacao');
  const [curriculo, setCurriculo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => { carregarCurriculo(); }, []);

  const carregarCurriculo = async () => {
    try {
      const resposta = await verCurriculo();
      setCurriculo(resposta.data.curriculo);
    } catch (erro) {
      toast.error('Erro ao carregar currículo.');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModal = () => {
    setForm({});
    setModalAberto(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (tabActiva === 'formacao') await adicionarFormacao({ ...form, ano_inicio: parseInt(form.ano_inicio), ano_fim: form.ano_fim ? parseInt(form.ano_fim) : null });
      else if (tabActiva === 'publicacoes') await adicionarPublicacao({ ...form, ano: parseInt(form.ano) });
      else if (tabActiva === 'livros') await adicionarLivro({ ...form, ano: parseInt(form.ano) });
      else if (tabActiva === 'premios') await adicionarPremio({ ...form, ano: parseInt(form.ano) });
      else if (tabActiva === 'projetos') await adicionarProjeto({ ...form, ano_inicio: parseInt(form.ano_inicio), ano_fim: form.ano_fim ? parseInt(form.ano_fim) : null });
      toast.success('Adicionado com sucesso!');
      setModalAberto(false);
      carregarCurriculo();
    } catch (erro) {
      toast.error('Erro ao adicionar.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('Eliminar este registo?')) return;
    try {
      if (tabActiva === 'formacao') await eliminarFormacao(id);
      else if (tabActiva === 'publicacoes') await eliminarPublicacao(id);
      else if (tabActiva === 'livros') await eliminarLivro(id);
      else if (tabActiva === 'premios') await eliminarPremio(id);
      else if (tabActiva === 'projetos') await eliminarProjeto(id);
      toast.success('Eliminado com sucesso!');
      carregarCurriculo();
    } catch (erro) {
      toast.error('Erro ao eliminar.');
    }
  };

  const dadosActuais = () => {
    if (!curriculo) return [];
    const map = {
      formacao: curriculo.formacoes,
      publicacoes: curriculo.publicacoes,
      livros: curriculo.livros,
      premios: curriculo.premios,
      projetos: curriculo.projetos
    };
    return map[tabActiva] || [];
  };

  const renderItem = (item) => {
    if (tabActiva === 'formacao') return (
      <div>
        <p className="font-medium text-gray-900">{item.curso}</p>
        <p className="text-sm text-gray-500">{item.instituicao}</p>
        <p className="text-xs text-gray-400 mt-1">{item.grau} · {item.ano_inicio} — {item.ano_fim || 'Actual'}</p>
      </div>
    );
    if (tabActiva === 'publicacoes') return (
      <div>
        <p className="font-medium text-gray-900">{item.titulo}</p>
        <p className="text-sm text-gray-500">{item.revista || item.tipo}</p>
        <p className="text-xs text-gray-400 mt-1">{item.ano}</p>
      </div>
    );
    if (tabActiva === 'livros') return (
      <div>
        <p className="font-medium text-gray-900">{item.titulo}</p>
        <p className="text-sm text-gray-500">{item.editora}</p>
        <p className="text-xs text-gray-400 mt-1">{item.ano}</p>
      </div>
    );
    if (tabActiva === 'premios') return (
      <div>
        <p className="font-medium text-gray-900">{item.titulo}</p>
        <p className="text-sm text-gray-500">{item.instituicao}</p>
        <p className="text-xs text-gray-400 mt-1">{item.ano}</p>
      </div>
    );
    if (tabActiva === 'projetos') return (
      <div>
        <p className="font-medium text-gray-900">{item.titulo}</p>
        <p className="text-sm text-gray-500">{item.financiador}</p>
        <p className="text-xs text-gray-400 mt-1">{item.ano_inicio} — {item.ano_fim || 'Em curso'}</p>
      </div>
    );
  };

  const renderFormulario = () => {
    const input = (campo, placeholder, tipo = 'text', obrigatorio = false) => (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">{placeholder} {obrigatorio && '*'}</label>
        <input
          type={tipo}
          className="input-field"
          placeholder={placeholder}
          value={form[campo] || ''}
          onChange={(e) => setForm(p => ({ ...p, [campo]: e.target.value }))}
          required={obrigatorio}
        />
      </div>
    );

    if (tabActiva === 'formacao') return (
      <div className="space-y-4">
        {input('instituicao', 'Instituição', 'text', true)}
        {input('curso', 'Curso', 'text', true)}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Grau *</label>
          <select className="input-field" value={form.grau || ''} onChange={(e) => setForm(p => ({ ...p, grau: e.target.value }))} required>
            <option value="">Selecciona o grau</option>
            {['Licenciatura', 'Mestrado', 'Doutoramento', 'Pós-Doutoramento', 'Outro'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {input('ano_inicio', 'Ano de início', 'number', true)}
          {input('ano_fim', 'Ano de conclusão', 'number')}
        </div>
      </div>
    );
    if (tabActiva === 'publicacoes') return (
      <div className="space-y-4">
        {input('titulo', 'Título', 'text', true)}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Tipo *</label>
          <select className="input-field" value={form.tipo || ''} onChange={(e) => setForm(p => ({ ...p, tipo: e.target.value }))} required>
            <option value="">Selecciona o tipo</option>
            {['Artigo', 'Conferência', 'Capítulo', 'Outro'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {input('ano', 'Ano', 'number', true)}
        {input('revista', 'Revista / Conferência')}
        {input('doi', 'DOI')}
      </div>
    );
    if (tabActiva === 'livros') return (
      <div className="space-y-4">
        {input('titulo', 'Título', 'text', true)}
        {input('editora', 'Editora')}
        {input('ano', 'Ano', 'number', true)}
        {input('isbn', 'ISBN')}
      </div>
    );
    if (tabActiva === 'premios') return (
      <div className="space-y-4">
        {input('titulo', 'Nome do prémio', 'text', true)}
        {input('instituicao', 'Instituição')}
        {input('ano', 'Ano', 'number', true)}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Descrição</label>
          <textarea className="input-field resize-none" rows={3} value={form.descricao || ''} onChange={(e) => setForm(p => ({ ...p, descricao: e.target.value }))} />
        </div>
      </div>
    );
    if (tabActiva === 'projetos') return (
      <div className="space-y-4">
        {input('titulo', 'Título do projecto', 'text', true)}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Descrição</label>
          <textarea className="input-field resize-none" rows={3} value={form.descricao || ''} onChange={(e) => setForm(p => ({ ...p, descricao: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {input('ano_inicio', 'Ano de início', 'number', true)}
          {input('ano_fim', 'Ano de conclusão', 'number')}
        </div>
        {input('financiador', 'Financiador')}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">O meu Currículo</h1>
            <p className="text-gray-500 text-sm mt-1">Gere a tua informação académica e profissional</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          {/* TABS */}
          <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = curriculo?.[tab.id === 'formacao' ? 'formacoes' : tab.id]?.length || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                    tabActiva === tab.id
                      ? 'border-primary-800 text-primary-800 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    tabActiva === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CONTEÚDO */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {dadosActuais().length} registo(s)
              </p>
              <button onClick={abrirModal} className="btn-primary">
                <Plus size={15} />
                Adicionar
              </button>
            </div>

            {carregando ? (
              <div className="text-center py-8 text-gray-400">A carregar...</div>
            ) : dadosActuais().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">Ainda não tens registos nesta secção.</p>
                <button onClick={abrirModal} className="text-primary-700 text-sm hover:underline mt-2">
                  Adicionar agora →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dadosActuais().map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    {renderItem(item)}
                    <button
                      onClick={() => handleEliminar(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-3 flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Adicionar {tabs.find(t => t.id === tabActiva)?.label}
              </h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleGuardar} className="p-6">
              {renderFormulario()}
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setModalAberto(false)} className="btn-outline flex-1 justify-center">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando} className="btn-primary flex-1 justify-center">
                  {guardando ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}