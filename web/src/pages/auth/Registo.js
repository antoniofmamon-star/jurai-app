import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registar } from '../../services/api';
import { Eye, EyeOff, UserPlus, GraduationCap, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Registo() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmarPassword: '',
    perfil: 'estudante'
  });

  const actualizar = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dados.nome) { toast.error('Introduz o teu nome completo.'); return; }
    if (!dados.email && !dados.telefone) { toast.error('Introduz o teu email ou telefone.'); return; }
    if (!dados.password) { toast.error('Introduz uma palavra-passe.'); return; }
    if (dados.password.length < 6) { toast.error('A palavra-passe deve ter pelo menos 6 caracteres.'); return; }
    if (dados.password !== dados.confirmarPassword) { toast.error('As palavras-passe não coincidem.'); return; }

    setCarregando(true);
    try {
      await registar({
        nome: dados.nome,
        email: dados.email || undefined,
        telefone: dados.telefone || undefined,
        password: dados.password,
        perfil: dados.perfil
      });
      toast.success('Pedido enviado! Aguarda aprovação do administrador.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (erro) {
      toast.error(erro.response?.data?.mensagem || 'Erro ao registar.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
            <span className="text-primary-900 font-bold">J</span>
          </div>
          <div>
            <div className="text-white font-semibold tracking-widest">JURAI</div>
            <div className="text-primary-300 text-xs">UNIKIVI · Uíge, Angola</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* TOPO */}
          <div className="bg-primary-800 px-8 py-5 text-center">
            <h2 className="text-white font-semibold text-lg">Criar conta nova</h2>
            <p className="text-primary-300 text-xs mt-1">Preenche os teus dados para te registares</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6">

            {/* TIPO DE CONTA */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Sou um...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { valor: 'estudante', label: 'Estudante', Icon: GraduationCap },
                  { valor: 'docente', label: 'Docente', Icon: BookOpen },
                ].map(({ valor, label, Icon }) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => actualizar('perfil', valor)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      dados.perfil === valor
                        ? 'border-primary-800 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={22} className={dados.perfil === valor ? 'text-primary-800' : 'text-gray-400'} />
                    <span className={`font-medium text-sm ${dados.perfil === valor ? 'text-primary-800' : 'text-gray-500'}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* NOME */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Nome completo *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="O teu nome completo"
                value={dados.nome}
                onChange={(e) => actualizar('nome', e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="nome@unikivi.ao"
                value={dados.email}
                onChange={(e) => actualizar('email', e.target.value)}
              />
            </div>

            {/* DIVISOR */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* TELEFONE */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Número de telefone
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="Ex: 923000000"
                value={dados.telefone}
                onChange={(e) => actualizar('telefone', e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Palavra-passe *
              </label>
              <div className="relative">
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Mínimo 6 caracteres"
                  value={dados.password}
                  onChange={(e) => actualizar('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* CONFIRMAR PASSWORD */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Confirmar palavra-passe *
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="Repete a palavra-passe"
                value={dados.confirmarPassword}
                onChange={(e) => actualizar('confirmarPassword', e.target.value)}
              />
            </div>

            {/* NOTA */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-5">
              <p className="text-xs text-blue-700 leading-relaxed">
                ℹ️ Após o registo, a tua conta ficará pendente até ser aprovada pelo administrador. Receberás uma notificação quando for aprovada.
              </p>
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-primary-800 hover:bg-primary-900 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {carregando ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  Enviar pedido de registo
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">já tens conta?</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <Link
              to="/login"
              className="w-full border border-primary-800 text-primary-800 hover:bg-primary-50 font-medium py-3 rounded-lg transition-all flex items-center justify-center text-sm"
            >
              Entrar na conta
            </Link>
          </form>
        </div>

        <p className="text-center text-primary-500 text-xs mt-6">
          Sistema JURAI v2.0 · UNIKIVI · Uíge, Angola
        </p>
      </div>
    </div>
  );
}