require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

const s = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

async function criarAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash('admin123', salt);

    await s.query(
      'INSERT INTO users (nome, email, password, perfil, estado, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
      {
        bind: ['Administrador JURAI', 'admin@unikivi.ao', passwordEncriptada, 'admin', 'activo']
      }
    );

    console.log('✅ Admin criado com sucesso!');
    console.log('📧 Email: admin@unikivi.ao');
    console.log('🔑 Password: admin123');

    s.close();
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
    s.close();
  }
}

criarAdmin();