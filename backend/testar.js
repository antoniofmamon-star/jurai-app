require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const s = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, { host: process.env.DB_HOST, dialect: 'mysql', logging: false });
s.query('SELECT id, email, estado, password FROM users WHERE email = "admin@unikivi.ao"').then(async ([r]) => {
  const u = r[0];
  console.log('estado:', u.estado);
  const ok = await bcrypt.compare('admin123', u.password);
  console.log('password admin123 correcta?', ok);
  s.close();
}).catch(e => { console.log('ERRO:', e.message); s.close(); });
