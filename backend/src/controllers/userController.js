const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Listar todos os utilizadores
const listarUtilizadores = async (req, res) => {
  try {
    const utilizadores = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      sucesso: true,
      total: utilizadores.length,
      utilizadores
    });

  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar utilizadores.', erro: erro.message });
  }
};

// Listar utilizadores pendentes
const listarPendentes = async (req, res) => {
  try {
    const pendentes = await User.findAll({
      where: { estado: 'pendente' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({
      sucesso: true,
      total: pendentes.length,
      pendentes
    });

  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar pendentes.', erro: erro.message });
  }
};

// Aprovar registo
const aprovarRegisto = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({ sucesso: false, mensagem: 'Utilizador não encontrado.' });
    }

    if (utilizador.estado !== 'pendente') {
      return res.status(400).json({ sucesso: false, mensagem: 'Este utilizador já foi processado.' });
    }

    await utilizador.update({
      estado: 'activo',
      aprovado_por: req.utilizador.id,
      data_aprovacao: new Date()
    });

    res.status(200).json({
      sucesso: true,
      mensagem: `Conta de ${utilizador.nome} aprovada com sucesso!`,
      utilizador: {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
        perfil: utilizador.perfil,
        estado: utilizador.estado
      }
    });

  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao aprovar registo.', erro: erro.message });
  }
};

// Rejeitar registo
const rejeitarRegisto = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({ sucesso: false, mensagem: 'Utilizador não encontrado.' });
    }

    await utilizador.destroy();

    res.status(200).json({
      sucesso: true,
      mensagem: 'Registo rejeitado e eliminado.'
    });

  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao rejeitar registo.', erro: erro.message });
  }
};

// Alterar status
const alterarStatus = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({ sucesso: false, mensagem: 'Utilizador não encontrado.' });
    }

    if (utilizador.id === req.utilizador.id) {
      return res.status(400).json({ sucesso: false, mensagem: 'Não podes alterar o estado da tua própria conta.' });
    }

    const novoEstado = utilizador.estado === 'activo' ? 'inactivo' : 'activo';
    await utilizador.update({ estado: novoEstado });

    res.status(200).json({
      sucesso: true,
      mensagem: `Conta ${novoEstado === 'activo' ? 'activada' : 'desactivada'} com sucesso.`,
      utilizador: { id: utilizador.id, nome: utilizador.nome, estado: novoEstado }
    });

  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao alterar status.', erro: erro.message });
  }
};

// Actualizar perfil
const actualizarPerfil = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({ sucesso: false, mensagem: 'Utilizador não encontrado.' });
    }

    const { nome, email, telefone, password, perfil } = req.body;
    let dadosActualizar = { nome, email, telefone, perfil };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      dadosActualizar.password = await bcrypt.hash(password, salt);
    }

    await utilizador.update(dadosActualizar);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Perfil actualizado com sucesso.',
      utilizador: { id: utilizador.id, nome: utilizador.nome, email: utilizador.email, perfil: utilizador.perfil }
    });

  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao actualizar perfil.', erro: erro.message });
  }
};

// Eliminar utilizador
const eliminarUtilizador = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({ sucesso: false, mensagem: 'Utilizador não encontrado.' });
    }

    if (utilizador.id === req.utilizador.id) {
      return res.status(400).json({ sucesso: false, mensagem: 'Não podes eliminar a tua própria conta.' });
    }

    await utilizador.destroy();

    res.status(200).json({ sucesso: true, mensagem: 'Utilizador eliminado com sucesso.' });

  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao eliminar utilizador.', erro: erro.message });
  }
};

// Listar docentes activos
const listarDocentes = async (req, res) => {
  try {
    const docentes = await User.findAll({
      where: { perfil: 'docente', estado: 'activo' },
      attributes: { exclude: ['password'] },
      order: [['nome', 'ASC']]
    });

    res.status(200).json({ sucesso: true, total: docentes.length, docentes });

  } catch (erro) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar docentes.', erro: erro.message });
  }
};

module.exports = {
  listarUtilizadores,
  listarPendentes,
  aprovarRegisto,
  rejeitarRegisto,
  alterarStatus,
  actualizarPerfil,
  eliminarUtilizador,
  listarDocentes
};