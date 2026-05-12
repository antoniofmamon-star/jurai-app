const express = require('express');
const router = express.Router();
const {
  listarUtilizadores,
  listarPendentes,
  aprovarRegisto,
  rejeitarRegisto,
  alterarStatus,
  actualizarPerfil,
  eliminarUtilizador,
  listarDocentes
} = require('../controllers/userController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

router.use(verificarToken);

// Docentes (todos os autenticados)
router.get('/docentes', listarDocentes);

// Administração
router.get('/', verificarAdmin, listarUtilizadores);
router.get('/pendentes', verificarAdmin, listarPendentes);
router.put('/:id/aprovar', verificarAdmin, aprovarRegisto);
router.delete('/:id/rejeitar', verificarAdmin, rejeitarRegisto);
router.put('/:id/status', verificarAdmin, alterarStatus);
router.put('/:id', verificarAdmin, actualizarPerfil);
router.delete('/:id', verificarAdmin, eliminarUtilizador);

module.exports = router;