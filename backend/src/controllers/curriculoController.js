const Formacao = require('../models/Formacao');
const Publicacao = require('../models/Publicacao');
const Livro = require('../models/Livro');
const Premio = require('../models/Premio');
const Projeto = require('../models/Projeto');
const Citacao = require('../models/Citacao');
const User = require('../models/User');

// Ver currículo completo de um docente
const verCurriculo = async (req, res) => {
  try {
    const userId = req.params.id || req.utilizador.id;

    const utilizador = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!utilizador) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Utilizador não encontrado.'
      });
    }

    const [formacoes, publicacoes, livros, premios, projetos, citacoes] = await Promise.all([
      Formacao.findAll({ where: { user_id: userId }, order: [['ano_inicio', 'DESC']] }),
      Publicacao.findAll({ where: { user_id: userId }, order: [['ano', 'DESC']] }),
      Livro.findAll({ where: { user_id: userId }, order: [['ano', 'DESC']] }),
      Premio.findAll({ where: { user_id: userId }, order: [['ano', 'DESC']] }),
      Projeto.findAll({ where: { user_id: userId }, order: [['ano_inicio', 'DESC']] }),
      Citacao.findAll({ where: { user_id: userId }, order: [['ano', 'DESC']] }),
    ]);

    res.status(200).json({
      sucesso: true,
      curriculo: {
        utilizador,
        formacoes,
        publicacoes,
        livros,
        premios,
        projetos,
        citacoes
      }
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar currículo.',
      erro: erro.message
    });
  }
};

// ── FORMAÇÃO ──
const adicionarFormacao = async (req, res) => {
  try {
    const { instituicao, curso, grau, ano_inicio, ano_fim } = req.body;
    const formacao = await Formacao.create({
      user_id: req.utilizador.id,
      instituicao, curso, grau, ano_inicio, ano_fim
    });
    res.status(201).json({ sucesso: true, mensagem: 'Formação adicionada!', formacao });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao adicionar formação.', erro: erro.message });
  }
};

const eliminarFormacao = async (req, res) => {
  try {
    const formacao = await Formacao.findOne({ where: { id: req.params.id, user_id: req.utilizador.id } });
    if (!formacao) return res.status(404).json({ sucesso: false, mensagem: 'Formação não encontrada.' });
    await formacao.destroy();
    res.status(200).json({ sucesso: true, mensagem: 'Formação eliminada.' });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar formação.', erro: erro.message });
  }
};

// ── PUBLICAÇÃO ──
const adicionarPublicacao = async (req, res) => {
  try {
    const { titulo, tipo, ano, doi, revista, link_pdf } = req.body;
    const publicacao = await Publicacao.create({
      user_id: req.utilizador.id,
      titulo, tipo, ano, doi, revista, link_pdf
    });
    res.status(201).json({ sucesso: true, mensagem: 'Publicação adicionada!', publicacao });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao adicionar publicação.', erro: erro.message });
  }
};

const eliminarPublicacao = async (req, res) => {
  try {
    const publicacao = await Publicacao.findOne({ where: { id: req.params.id, user_id: req.utilizador.id } });
    if (!publicacao) return res.status(404).json({ sucesso: false, mensagem: 'Publicação não encontrada.' });
    await publicacao.destroy();
    res.status(200).json({ sucesso: true, mensagem: 'Publicação eliminada.' });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar publicação.', erro: erro.message });
  }
};

// ── LIVRO ──
const adicionarLivro = async (req, res) => {
  try {
    const { titulo, editora, ano, isbn } = req.body;
    const livro = await Livro.create({
      user_id: req.utilizador.id,
      titulo, editora, ano, isbn
    });
    res.status(201).json({ sucesso: true, mensagem: 'Livro adicionado!', livro });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao adicionar livro.', erro: erro.message });
  }
};

const eliminarLivro = async (req, res) => {
  try {
    const livro = await Livro.findOne({ where: { id: req.params.id, user_id: req.utilizador.id } });
    if (!livro) return res.status(404).json({ sucesso: false, mensagem: 'Livro não encontrado.' });
    await livro.destroy();
    res.status(200).json({ sucesso: true, mensagem: 'Livro eliminado.' });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar livro.', erro: erro.message });
  }
};

// ── PRÉMIO ──
const adicionarPremio = async (req, res) => {
  try {
    const { titulo, instituicao, ano, descricao } = req.body;
    const premio = await Premio.create({
      user_id: req.utilizador.id,
      titulo, instituicao, ano, descricao
    });
    res.status(201).json({ sucesso: true, mensagem: 'Prémio adicionado!', premio });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao adicionar prémio.', erro: erro.message });
  }
};

const eliminarPremio = async (req, res) => {
  try {
    const premio = await Premio.findOne({ where: { id: req.params.id, user_id: req.utilizador.id } });
    if (!premio) return res.status(404).json({ sucesso: false, mensagem: 'Prémio não encontrado.' });
    await premio.destroy();
    res.status(200).json({ sucesso: true, mensagem: 'Prémio eliminado.' });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar prémio.', erro: erro.message });
  }
};

// ── PROJECTO ──
const adicionarProjeto = async (req, res) => {
  try {
    const { titulo, descricao, ano_inicio, ano_fim, financiador } = req.body;
    const projeto = await Projeto.create({
      user_id: req.utilizador.id,
      titulo, descricao, ano_inicio, ano_fim, financiador
    });
    res.status(201).json({ sucesso: true, mensagem: 'Projecto adicionado!', projeto });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao adicionar projecto.', erro: erro.message });
  }
};

const eliminarProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findOne({ where: { id: req.params.id, user_id: req.utilizador.id } });
    if (!projeto) return res.status(404).json({ sucesso: false, mensagem: 'Projecto não encontrado.' });
    await projeto.destroy();
    res.status(200).json({ sucesso: true, mensagem: 'Projecto eliminado.' });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar projecto.', erro: erro.message });
  }
};

// ── CITAÇÃO ──
const adicionarCitacao = async (req, res) => {
  try {
    const { titulo, autores, ano, fonte } = req.body;
    const citacao = await Citacao.create({
      user_id: req.utilizador.id,
      titulo, autores, ano, fonte
    });
    res.status(201).json({ sucesso: true, mensagem: 'Citação adicionada!', citacao });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao adicionar citação.', erro: erro.message });
  }
};

const eliminarCitacao = async (req, res) => {
  try {
    const citacao = await Citacao.findOne({ where: { id: req.params.id, user_id: req.utilizador.id } });
    if (!citacao) return res.status(404).json({ sucesso: false, mensagem: 'Citação não encontrada.' });
    await citacao.destroy();
    res.status(200).json({ sucesso: true, mensagem: 'Citação eliminada.' });
  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar citação.', erro: erro.message });
  }
};

module.exports = {
  verCurriculo,
  adicionarFormacao, eliminarFormacao,
  adicionarPublicacao, eliminarPublicacao,
  adicionarLivro, eliminarLivro,
  adicionarPremio, eliminarPremio,
  adicionarProjeto, eliminarProjeto,
  adicionarCitacao, eliminarCitacao
};