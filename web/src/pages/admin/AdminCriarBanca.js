import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { criarMesa } from '../../services/api';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCriarBanca() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState({
    nome_estudante: '',
    tema: '',
    curso: '',
    ano: '',
    data_defesa: '',
    hora_defesa: '',
    local_defesa: '',
    segundo_vogal_tutor: '',
    secretario: '',
  });

  const actualizar = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dados.nome_estudante || !dados.tema || !dados.curso ||
        !dados.ano || !dados.segundo_vogal_tutor || !dados.secretario) {
      toast.error('Por favor preenche todos os campos obrigatórios.');
      return;
    }
    setCarregando(true);
    try {
      const resposta = await criarMesa(dados);
      toast.success('Banca criada com sucesso!');
      navigate(`/admin/bancas/${resposta.data.mesa.id}`);
    } catch (erro) {
      toast.error(erro.response?.data?.mensagem || 'Erro ao criar banca.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* CABEÇALHO */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/bancas')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Nova banca de júri</h1>
            <p className="text-gray-500 text-sm mt-1">Preenche os dados para criar uma nova banca</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* DADOS DO ESTUDANTE */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
              Dados do Estudante
            </h2>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Nome do Estudante *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nome completo do estudante"
                  value={dados.nome_estudante}
                  onChange={(e) => actualizar('nome_estudante', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Tema da Defesa *
                </label>
                <textarea
                  className="input-field resize-none"
                  placeholder="Título completo do trabalho de fim de curso"
                  rows={3}
                  value={dados.tema}
                  onChange={(e) => actualizar('tema', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Curso *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ex: Engenharia Informática"
                    value={dados.curso}
                    onChange={(e) => actualizar('curso', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Ano *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ex: 4.º Ano"
                    value={dados.ano}
                    onChange={(e) => actualizar('ano', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DADOS DA DEFESA */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
              Dados da Defesa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Data da Defesa
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={dados.data_defesa}
                  onChange={(e) => actualizar('data_defesa', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Hora
                </label>
                <input
                  type="time"
                  className="input-field"
                  value={dados.hora_defesa}
                  onChange={(e) => actualizar('hora_defesa', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Local
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Sala de Actos"
                  value={dados.local_defesa}
                  onChange={(e) => actualizar('local_defesa', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* MEMBROS CONHECIDOS */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-2 pb-3 border-b border-gray-100">
              Membros Conhecidos
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              O Presidente, 1.º Vogal e Suplente serão sugeridos pelo Agente IA após criar a banca.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  2.º Vogal — Tutor/Orientador *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nome completo do tutor"
                  value={dados.segundo_vogal_tutor}
                  onChange={(e) => actualizar('segundo_vogal_tutor', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Secretário *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nome completo do secretário"
                  value={dados.secretario}
                  onChange={(e) => actualizar('secretario', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* NOTA IA */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              💡 Após criar a banca, poderás usar o <strong>Agente IA</strong> para sugerir automaticamente o Presidente, 1.º Vogal e Suplente com base no tema da defesa.
            </p>
          </div>

          {/* BOTÕES */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/bancas')}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="btn-gold"
            >
              {carregando ? (
                <div className="w-4 h-4 border-2 border-primary-900/30 border-t-primary-900 rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  Criar banca
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}