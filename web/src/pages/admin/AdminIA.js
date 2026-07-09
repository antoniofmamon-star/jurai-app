import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { chatIA } from '../../services/api';
import { Bot, Send, User } from 'lucide-react';

export default function AdminIA() {
  const [mensagens, setMensagens] = useState([
    {
      id: '1',
      tipo: 'ia',
      texto: 'Olá! Sou o assistente do Sistema JURAI da Universidade Kimpa Vita. Posso ajudá-lo a gerir bancas de júri, sugerir membros, gerar despachos ou responder a qualquer dúvida sobre o sistema. Como posso ajudar?'
    }
  ]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!input.trim() || carregando) return;

    const textoUtilizador = input.trim();
    setInput('');

    setMensagens(prev => [...prev, {
      id: Date.now().toString(),
      tipo: 'utilizador',
      texto: textoUtilizador
    }]);

    setCarregando(true);
    try {
      const resposta = await chatIA(textoUtilizador);
      setMensagens(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        tipo: 'ia',
        texto: resposta.data.resposta
      }]);
    } catch (erro) {
      setMensagens(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        tipo: 'ia',
        texto: 'Desculpe, ocorreu um erro. Por favor tente novamente.'
      }]);
    } finally {
      setCarregando(false);
    }
  };

  const sugestoes = [
    'Quais são as bancas desta semana?',
    'Quem está disponível para júri de Informática?',
    'Como funciona o processo de aprovação?',
    'Quantas bancas foram aprovadas este mês?',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col flex-1">

        {/* CABEÇALHO */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary-800 rounded-xl flex items-center justify-center">
            <Bot size={24} className="text-gold-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Agente IA — JURAI</h1>
            <p className="text-gray-500 text-sm">Assistente académico inteligente · UNIKIVI</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 text-sm font-medium">Online</span>
          </div>
        </div>

        {/* ÁREA DE CHAT */}
        <div className="card flex-1 flex flex-col overflow-hidden" style={{ minHeight: '500px' }}>

          {/* MENSAGENS */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {/* SUGESTÕES */}
            {mensagens.length === 1 && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
                  Sugestões de perguntas
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sugestoes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(s)}
                      className="text-left text-sm text-gray-600 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 border border-gray-200 hover:border-primary-200 rounded-lg p-3 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.tipo === 'utilizador' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.tipo === 'ia' && (
                  <div className="w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={14} className="text-gold-400" />
                  </div>
                )}
                <div className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.tipo === 'utilizador'
                    ? 'bg-primary-800 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.texto}
                </div>
                {msg.tipo === 'utilizador' && (
                  <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User size={14} className="text-primary-900" />
                  </div>
                )}
              </div>
            ))}

            {/* INDICADOR DE ESCRITA */}
            {carregando && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-gold-400" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="border-t border-gray-100 p-4">
            <form onSubmit={enviarMensagem} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreve uma mensagem..."
                className="input-field flex-1"
                disabled={carregando}
              />
              <button
                type="submit"
                disabled={!input.trim() || carregando}
                className="w-11 h-11 bg-primary-800 hover:bg-primary-900 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}