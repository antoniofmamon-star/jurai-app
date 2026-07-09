const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
      }
    }
  );
}

const testarLigacao = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Ligação ao PostgreSQL estabelecida com sucesso!');
  } catch (erro) {
    console.error('❌ Erro ao ligar ao PostgreSQL:', erro.message);
  }
};

testarLigacao();

module.exports = sequelize;