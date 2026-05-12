require('dotenv').config();
const { Sequelize } = require('sequelize');

const s = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'mysql', logging: false }
);

async function corrigir() {
  try {
    const [users] = await s.query("SELECT id, nome, email, perfil, estado FROM users");
    console.log('📋 Utilizadores actuais:');
    users.forEach(u => console.log(`  ID:${u.id} - ${u.nome} (${u.perfil}) → ${u.email} → ${u.estado}`));
    s.close();
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
    s.close();
  }
}

corrigir();