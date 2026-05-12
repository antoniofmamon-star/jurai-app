const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

// Importar modelos
require('./models/User');
require('./models/Mesa');
require('./models/Formacao');
require('./models/Publicacao');
require('./models/Livro');
require('./models/Premio');
require('./models/Projeto');
require('./models/Citacao');

const PORT = process.env.PORT || 3000;

const arrancar = async () => {
  try {
   await sequelize.sync({ force: false });
    console.log('✅ Base de dados sincronizada!');

    app.listen(PORT, () => {
      console.log(`✅ Servidor JURAI a correr na porta ${PORT}`);
      console.log(`🌐 Acede em: http://localhost:${PORT}`);
      console.log(`📋 Ambiente: ${process.env.NODE_ENV}`);
    });
  } catch (erro) {
    console.error('❌ Erro ao arrancar o servidor:', erro.message);
  }
};

arrancar();