const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  // Buscar o token no cabeçalho da requisição
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Se não houver token, negar o acesso
  if (!token) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Acesso negado. Token não fornecido.'
    });
  }

  // Verificar se o token é válido
  try {
    const utilizador = jwt.verify(token, process.env.JWT_SECRET);
    req.utilizador = utilizador;
    next();
  } catch (erro) {
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Token inválido ou expirado.'
    });
  }
};

// Middleware para verificar se o utilizador é administrador
const verificarAdmin = (req, res, next) => {
  if (req.utilizador.perfil !== 'admin') {
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};

module.exports = { verificarToken, verificarAdmin };