const { Sequelize } = require('sequelize');
require('dotenv').config();

// Criar a ligação à base de dados
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORTA,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    }
  }
);

// Testar a ligação
const testarLigacao = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Ligação à base de dados estabelecida com sucesso!');
  } catch (erro) {
    console.error('❌ Erro ao ligar à base de dados:', erro.message);
  }
};

testarLigacao();

module.exports = sequelize;