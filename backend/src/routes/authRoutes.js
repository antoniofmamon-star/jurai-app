const express = require('express');
const router = express.Router();
const { registar, login, eu } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

// Rotas públicas (não precisam de token)
router.post('/registar', registar);
router.post('/login', login);

// Rotas protegidas (precisam de token)
router.get('/eu', verificarToken, eu);

module.exports = router;