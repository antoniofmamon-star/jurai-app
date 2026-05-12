const express = require('express');
const cors = require('cors');
const path = require('path');
const curriculoRoutes = require('./routes/curriculoRoutes');
require('dotenv').config();

// Importar middlewares
const { verificarToken } = require('./middlewares/auth');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const mesaRoutes = require('./routes/mesaRoutes');
const iaRoutes = require('./routes/iaRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Servidor JURAI está online!',
    versao: '1.0.0',
    estado: 'OK'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/curriculo', curriculoRoutes);

// Rota para descarregar PDFs
app.use('/api/despachos/download', verificarToken, (req, res) => {
  const nomeFicheiro = req.path.replace('/', '');
  const caminhoFicheiro = path.join(__dirname, '../outputs', nomeFicheiro);
  res.download(caminhoFicheiro, nomeFicheiro, (erro) => {
    if (erro) {
      res.status(404).json({ sucesso: false, mensagem: 'Ficheiro não encontrado.' });
    }
  });
});

module.exports = app;