const express = require('express');
const router = express.Router();
const path = require('path');
const { sugerirMembrosMesa, chatIA, gerarDespachoIA } = require('../controllers/iaController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

// Todas as rotas precisam de autenticação
router.use(verificarToken);

// Rotas do agente IA
router.post('/sugerir-juri/:id', verificarAdmin, sugerirMembrosMesa);
router.post('/chat', chatIA);
router.post('/gerar-despacho/:id', verificarAdmin, gerarDespachoIA);

module.exports = router;