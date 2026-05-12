const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

// Registar novo utilizador
const registar = async (req, res) => {
  try {
    const { nome, email, telefone, password, perfil } = req.body;

    // Validar campos obrigatórios
    if (!nome || !password) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome e password são obrigatórios.'
      });
    }

    // Pelo menos email ou telefone é obrigatório
    if (!email && !telefone) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'É necessário fornecer um email ou número de telefone.'
      });
    }

    // Não permitir registo como admin pelo auto-registo
    if (perfil === 'admin') {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Não é possível registar uma conta de administrador. Contacta o administrador do sistema.'
      });
    }

    // Verificar se o email já existe
    if (email) {
      const emailExiste = await User.findOne({ where: { email } });
      if (emailExiste) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Este email já está registado.'
        });
      }
    }

    // Verificar se o telefone já existe
    if (telefone) {
      const telefoneExiste = await User.findOne({ where: { telefone } });
      if (telefoneExiste) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Este número de telefone já está registado.'
        });
      }
    }

    // Encriptar a password
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Criar o utilizador com estado PENDENTE
    const utilizador = await User.create({
      nome,
      email: email || null,
      telefone: telefone || null,
      password: passwordEncriptada,
      perfil: perfil || 'estudante',
      estado: 'pendente'
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Registo enviado com sucesso! A tua conta está a aguardar aprovação do administrador. Serás notificado quando for aprovada.',
      utilizador: {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
        telefone: utilizador.telefone,
        perfil: utilizador.perfil,
        estado: utilizador.estado
      }
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao registar utilizador.',
      erro: erro.message
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, telefone, password } = req.body;

    if (!password || (!email && !telefone)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Fornece o email ou telefone e a password.'
      });
    }

    // Buscar utilizador por email ou telefone
    let utilizador;
    if (email) {
      utilizador = await User.findOne({ where: { email } });
    } else {
      utilizador = await User.findOne({ where: { telefone } });
    }

    if (!utilizador) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais incorrectas.'
      });
    }

    // Verificar estado da conta
    if (utilizador.estado === 'pendente') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'A tua conta ainda está a aguardar aprovação do administrador. Tenta mais tarde.'
      });
    }

    if (utilizador.estado === 'inactivo') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'A tua conta foi desactivada. Contacta o administrador.'
      });
    }

    // Verificar password
    const passwordCorrecta = await bcrypt.compare(password, utilizador.password);
    if (!passwordCorrecta) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais incorrectas.'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: utilizador.id, email: utilizador.email, perfil: utilizador.perfil },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      sucesso: true,
      mensagem: 'Login efectuado com sucesso!',
      token,
      utilizador: {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
        telefone: utilizador.telefone,
        perfil: utilizador.perfil,
        estado: utilizador.estado
      }
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao fazer login.',
      erro: erro.message
    });
  }
};

// Dados do utilizador autenticado
const eu = async (req, res) => {
  try {
    const utilizador = await User.findByPk(req.utilizador.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({ sucesso: true, utilizador });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar dados do utilizador.',
      erro: erro.message
    });
  }
};

module.exports = { registar, login, eu };