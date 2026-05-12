const Mesa = require('../models/Mesa');

// Listar todas as mesas
const listarMesas = async (req, res) => {
  try {
    const mesas = await Mesa.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      sucesso: true,
      total: mesas.length,
      mesas
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar mesas.',
      erro: erro.message
    });
  }
};

// Ver detalhes de uma mesa
const verMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);

    if (!mesa) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Mesa não encontrada.'
      });
    }

    res.status(200).json({
      sucesso: true,
      mesa
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar mesa.',
      erro: erro.message
    });
  }
};

// Criar nova mesa
const criarMesa = async (req, res) => {
  try {
    const {
      nome_estudante,
      tema,
      curso,
      ano,
      data_defesa,
      hora_defesa,
      local_defesa,
      segundo_vogal_tutor,
      secretario
    } = req.body;

    // Validar campos obrigatórios
    if (!nome_estudante || !tema || !curso || !ano || !segundo_vogal_tutor || !secretario) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Por favor preenche todos os campos obrigatórios: nome do estudante, tema, curso, ano, tutor e secretário.'
      });
    }

    const mesa = await Mesa.create({
      nome_estudante,
      tema,
      curso,
      ano,
      data_defesa,
      hora_defesa,
      local_defesa,
      segundo_vogal_tutor,
      secretario,
      estado: 'rascunho',
      criado_por: req.utilizador.id
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Mesa criada com sucesso!',
      mesa
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar mesa.',
      erro: erro.message
    });
  }
};

// Editar mesa
const editarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);

    if (!mesa) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Mesa não encontrada.'
      });
    }

    // Não permitir editar uma mesa já aprovada
    if (mesa.estado === 'aprovado') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Não é possível editar uma mesa já aprovada.'
      });
    }

    await mesa.update(req.body);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Mesa actualizada com sucesso!',
      mesa
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao editar mesa.',
      erro: erro.message
    });
  }
};

// Aprovar mesa
const aprovarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);

    if (!mesa) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Mesa não encontrada.'
      });
    }

    // Verificar se a mesa tem todos os membros definidos
    if (
      mesa.presidente === 'Aguardando sugestão da IA' ||
      mesa.primeiro_vogal === 'Aguardando sugestão da IA' ||
      mesa.suplente === 'Aguardando sugestão da IA'
    ) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'A mesa ainda tem membros por definir. Usa o agente IA para sugerir os membros em falta.'
      });
    }

    await mesa.update({ estado: 'aprovado' });

    res.status(200).json({
      sucesso: true,
      mensagem: 'Mesa aprovada com sucesso! O despacho pode agora ser gerado.',
      mesa
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao aprovar mesa.',
      erro: erro.message
    });
  }
};

// Eliminar mesa
const eliminarMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);

    if (!mesa) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Mesa não encontrada.'
      });
    }

    // Não permitir eliminar uma mesa aprovada
    if (mesa.estado === 'aprovado') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Não é possível eliminar uma mesa já aprovada.'
      });
    }

    await mesa.destroy();

    res.status(200).json({
      sucesso: true,
      mensagem: 'Mesa eliminada com sucesso.'
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao eliminar mesa.',
      erro: erro.message
    });
  }
};

module.exports = {
  listarMesas,
  verMesa,
  criarMesa,
  editarMesa,
  aprovarMesa,
  eliminarMesa
};