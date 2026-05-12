const express = require('express');
const router = express.Router();
const {
  listarMesas,
  verMesa,
  criarMesa,
  editarMesa,
  aprovarMesa,
  eliminarMesa
} = require('../controllers/mesaController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

// Todas as rotas das mesas precisam de autenticação
router.use(verificarToken);

// Rotas
router.get('/', listarMesas);
router.get('/:id', verMesa);
router.post('/', verificarAdmin, criarMesa);
router.put('/:id', verificarAdmin, editarMesa);
router.post('/:id/aprovar', verificarAdmin, aprovarMesa);
router.delete('/:id', verificarAdmin, eliminarMesa);

module.exports = router;