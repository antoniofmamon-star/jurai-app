require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

const s = new Sequelize(
  'postgresql://jurai_db_user:845GeJjcoj5Eiu1bTP5lJMC2RHhnSN3f@dpg-d9818qu7r5hc73aos7hg-a.frankfurt-postgres.render.com/jurai_db',
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
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

    console.log('✅ Admin criado com sucesso na base de dados do Render!');
    console.log('📧 Email: admin@unikivi.ao');
    console.log('🔑 Password: admin123');

    s.close();
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
    s.close();
  }
}

criarAdmin();