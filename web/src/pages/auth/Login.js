import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [dados, setDados] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dados.email || !dados.password) {
      toast.error('Por favor preenche todos os campos.');
      return;
    }
    setCarregando(true);
    const resultado = await login(dados.email, dados.password);
    setCarregando(false);
    if (resultado.sucesso) {
      toast.success('Login efectuado com sucesso!');
      navigate(`/${resultado.perfil}`);
    } else {
      toast.error(resultado.mensagem);
    }
  };

  return (
    <div className="min-h-screen bg-primary-900 flex">

      {/* LADO ESQUERDO — INFO */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
            <span className="text-primary-900 font-bold">J</span>
          </div>
          <div>
            <div className="text-white font-semibold tracking-widest">JURAI</div>
            <div className="text-primary-300 text-xs">UNIKIVI · Uíge, Angola</div>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs px-3 py-1.5 rounded-full mb-6">
            ✦ Com Inteligência Artificial
          </div>
          <h1 className="text-4xl font-light text-white leading-tight mb-4">
            Gestão de<br />
            <span className="text-gold-400 font-semibold">Bancas de Defesa</span><br />
            da UNIKIVI
          </h1>
          <p className="text-primary-300 text-sm leading-relaxed mb-8 max-w-sm">
            Sistema digital para constituição automática de mesas de júri, geração de despachos e acompanhamento do processo académico.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { num: '3', label: 'Perfis de acesso' },
              { num: 'IA', label: 'Sugestão automática' },
              { num: 'PDF', label: 'Despacho oficial' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-gold-400 text-2xl font-semibold">{s.num}</div>
                <div className="text-primary-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-primary-500 text-xs italic">
          Cientificidade · Inovação · Desenvolvimento
        </div>
      </div>

      {/* LADO DIREITO — FORMULÁRIO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* LOGO MOBILE */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
              <span className="text-primary-900 font-bold">J</span>
            </div>
            <div>
              <div className="text-white font-semibold tracking-widest">JURAI</div>
              <div className="text-primary-300 text-xs">UNIKIVI · Uíge, Angola</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-primary-800 px-8 py-6 text-center">
              <div className="w-14 h-14 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-900 font-bold text-xl">J</span>
              </div>
              <h2 className="text-white font-semibold text-lg">Bem-vindo ao JURAI</h2>
              <p className="text-primary-300 text-xs mt-1">Universidade Kimpa Vita</p>
              <p className="text-primary-500 text-xs italic mt-0.5">Cientificidade · Inovação · Desenvolvimento</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7">
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Email institucional
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="nome@unikivi.ao"
                  value={dados.email}
                  onChange={(e) => setDados(p => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Palavra-passe
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    className="input-field pr-10"
                    placeholder="A tua palavra-passe"
                    value={dados.password}
                    onChange={(e) => setDados(p => ({ ...p, password: e.target.value }))}
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

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-primary-800 hover:bg-primary-900 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {carregando ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={16} />
                    Entrar na conta
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">não tens conta?</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <Link
                to="/registo"
                className="w-full border border-primary-800 text-primary-800 hover:bg-primary-50 font-medium py-3 rounded-lg transition-all flex items-center justify-center text-sm"
              >
                Criar conta nova
              </Link>
            </form>
          </div>

          <p className="text-center text-primary-500 text-xs mt-6">
            Sistema JURAI v2.0 · UNIKIVI · Uíge, Angola
          </p>
        </div>
      </div>
    </div>
  );
}