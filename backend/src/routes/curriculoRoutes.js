const express = require('express');
const router = express.Router();
const {
  verCurriculo,
  adicionarFormacao, eliminarFormacao,
  adicionarPublicacao, eliminarPublicacao,
  adicionarLivro, eliminarLivro,
  adicionarPremio, eliminarPremio,
  adicionarProjeto, eliminarProjeto,
  adicionarCitacao, eliminarCitacao
} = require('../controllers/curriculoController');
const { verificarToken } = require('../middlewares/auth');

// Todas as rotas precisam de autenticação
router.use(verificarToken);

// Ver currículo
router.get('/meu', verCurriculo);
router.get('/:id', verCurriculo);

// Formação
router.post('/formacao', adicionarFormacao);
router.delete('/formacao/:id', eliminarFormacao);

// Publicação
router.post('/publicacao', adicionarPublicacao);
router.delete('/publicacao/:id', eliminarPublicacao);

// Livro
router.post('/livro', adicionarLivro);
router.delete('/livro/:id', eliminarLivro);

// Prémio
router.post('/premio', adicionarPremio);
router.delete('/premio/:id', eliminarPremio);

// Projecto
router.post('/projeto', adicionarProjeto);
router.delete('/projeto/:id', eliminarProjeto);

// Citação
router.post('/citacao', adicionarCitacao);
router.delete('/citacao/:id', eliminarCitacao);

module.exports = router;