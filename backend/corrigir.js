require('dotenv').config();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

const s = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'mysql', logging: false }
);

async function corrigir() {
  try {
    await s.authenticate();
    console.log('✅ Ligação à base de dados OK\n');

    // 1. Ver estado actual de todos os utilizadores
    const [antes] = await s.query("SELECT id, nome, email, perfil, estado FROM users");
    console.log(`📋 Utilizadores encontrados: ${antes.length}`);
    antes.forEach(u => console.log(`  ID:${u.id} | ${u.nome} | perfil:${u.perfil} | estado:${u.estado}`));

    // 2. Activar TODOS os utilizadores que estão pendentes
    //    (apenas os que não estão inactivos propositadamente)
    const [resultPendentes] = await s.query(
      "UPDATE users SET estado = 'activo' WHERE estado = 'pendente'"
    );
    console.log(`\n✅ Contas activadas (eram pendentes): ${resultPendentes.affectedRows}`);

    // 3. Garantir que o admin está activo e com password correcta
    const novaPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(novaPassword, salt);

    const [resultAdmin] = await s.query(
      `UPDATE users SET password = '${passwordEncriptada}', estado = 'activo' WHERE perfil = 'admin'`
    );
    console.log(`✅ Conta(s) admin actualizadas: ${resultAdmin.affectedRows}`);

    // 4. Mostrar estado final
    const [depois] = await s.query("SELECT id, nome, email, perfil, estado FROM users");
    console.log('\n📋 Estado final dos utilizadores:');
    depois.forEach(u => console.log(`  ID:${u.id} | ${u.nome} | perfil:${u.perfil} | estado:${u.estado}`));

    console.log('\n🔑 Credenciais do admin:');
    const [admins] = await s.query("SELECT email, telefone FROM users WHERE perfil = 'admin'");
    admins.forEach(a => {
      if (a.email)    console.log(`  Email:    ${a.email}`);
      if (a.telefone) console.log(`  Telefone: ${a.telefone}`);
    });
    console.log('  Password: admin123');
    console.log('\n⚠️  Lembra-te de alterar a password depois de entrar!');

    s.close();
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
    s.close();
  }
}

corrigir();
