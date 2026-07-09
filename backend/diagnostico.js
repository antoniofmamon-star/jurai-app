require('dotenv').config();
const { Sequelize } = require('sequelize');

const s = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'mysql', logging: false }
);

async function diagnosticar() {
  try {
    console.log('🔍 A ligar à base de dados...');
    await s.authenticate();
    console.log('✅ Ligação OK\n');

    // 1. Ver estrutura da tabela users
    const [colunas] = await s.query("DESCRIBE users");
    console.log('📋 Estrutura da tabela users:');
    colunas.forEach(c => console.log(`  ${c.Field} | ${c.Type} | null:${c.Null} | default:${c.Default}`));

    // 2. Ver todos os utilizadores
    const [users] = await s.query("SELECT id, nome, email, perfil, estado, LEFT(password, 10) as pass_inicio, LENGTH(password) as pass_len FROM users");
    console.log(`\n👥 Utilizadores (${users.length} total):`);
    users.forEach(u => {
      console.log(`  ID:${u.id} | ${u.nome} | ${u.email}`);
      console.log(`    perfil:${u.perfil} | estado:${u.estado}`);
      console.log(`    password: ${u.pass_inicio}... (${u.pass_len} chars)`);

      // Detectar tipo de hash
      if (u.pass_inicio && u.pass_inicio.startsWith('$2b$')) {
        console.log(`    ✅ Hash bcrypt normal`);
      } else if (u.pass_inicio && u.pass_inicio.startsWith('$2b$10$') === false && u.pass_inicio.startsWith('$2')) {
        console.log(`    ⚠️  Hash bcrypt mas formato diferente`);
      } else if (u.pass_len === 60 || u.pass_len === 32) {
        console.log(`    ⚠️  Pode ser MD5 ou outro hash`);
      } else {
        console.log(`    ❌ Formato desconhecido ou password em texto plano`);
      }
    });

    // 3. Verificar se há campo estado bloqueado
    const [bloqueados] = await s.query("SELECT COUNT(*) as total FROM users WHERE estado != 'ativo' AND estado != 'active' AND estado IS NOT NULL");
    if (bloqueados[0].total > 0) {
      console.log(`\n⚠️  ${bloqueados[0].total} utilizador(es) com estado diferente de 'ativo'`);
      const [lista] = await s.query("SELECT id, nome, estado FROM users WHERE estado != 'ativo' AND estado != 'active'");
      lista.forEach(u => console.log(`  ID:${u.id} - ${u.nome} → estado: "${u.estado}"`));
    }

    s.close();
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
    s.close();
  }
}

diagnosticar();
