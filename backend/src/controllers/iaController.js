const { sugerirJuri, chat, gerarDespacho } = require('../services/geminiService');
const { gerarPDFDespacho } = require('../services/pdfService');
const Mesa = require('../models/Mesa');
const User = require('../models/User');
const path = require('path');

// Sugerir membros do júri para uma mesa
const sugerirMembrosMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);

    if (!mesa) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Mesa não encontrada.'
      });
    }

    // Buscar todos os docentes activos
    const docentes = await User.findAll({
      where: { perfil: 'docente', activo: true },
      attributes: ['id', 'nome']
    });

    if (docentes.length < 3) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'É necessário ter pelo menos 3 docentes registados no sistema para sugerir um júri.'
      });
    }

    // Formatar lista de docentes para o agente IA
    const listaDocentes = docentes.map(d => ({
      nome: d.nome,
      especialidade: 'Docente universitário',
      formacao: 'Ensino Superior'
    }));

    // Chamar o agente IA
    const resultado = await sugerirJuri(mesa.tema, mesa.curso, listaDocentes);

    if (!resultado.sucesso) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao gerar sugestão.',
        erro: resultado.erro
      });
    }

    // Actualizar a mesa com as sugestões da IA
    await mesa.update({
      presidente: resultado.sugestao.presidente,
      primeiro_vogal: resultado.sugestao.primeiro_vogal,
      suplente: resultado.sugestao.suplente,
      justificacao_ia: resultado.sugestao.justificacao,
      estado: 'sugerido'
    });

    res.status(200).json({
      sucesso: true,
      mensagem: 'Sugestão de júri gerada com sucesso!',
      sugestao: resultado.sugestao,
      mesa
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao sugerir membros do júri.',
      erro: erro.message
    });
  }
};

// Chat com o agente IA
const chatIA = async (req, res) => {
  try {
    const { mensagem, contexto } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Por favor escreve uma mensagem.'
      });
    }

    const resultado = await chat(mensagem, contexto);

    if (!resultado.sucesso) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao processar mensagem.',
        erro: resultado.erro
      });
    }

    res.status(200).json({
      sucesso: true,
      resposta: resultado.resposta
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro no chat com o agente IA.',
      erro: erro.message
    });
  }
};

// Gerar despacho com IA e PDF
const gerarDespachoIA = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);

    if (!mesa) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Mesa não encontrada.'
      });
    }

    if (mesa.estado !== 'aprovado') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'A mesa ainda não foi aprovada. Aprova a mesa primeiro antes de gerar o despacho.'
      });
    }

    // Gerar o texto do despacho com IA
    const resultadoTexto = await gerarDespacho(mesa);

    if (!resultadoTexto.sucesso) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao gerar texto do despacho.',
        erro: resultadoTexto.erro
      });
    }

    // Gerar o PDF
    const resultadoPDF = await gerarPDFDespacho(mesa, resultadoTexto.despacho);

    if (!resultadoPDF.sucesso) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao gerar PDF.',
        erro: resultadoPDF.erro
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Despacho gerado com sucesso!',
      despacho: resultadoTexto.despacho,
      pdf: {
        nome: resultadoPDF.nome,
        url: `/api/despachos/download/${resultadoPDF.nome}`
      }
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao gerar despacho.',
      erro: erro.message
    });
  }
};

module.exports = { sugerirMembrosMesa, chatIA, gerarDespachoIA };