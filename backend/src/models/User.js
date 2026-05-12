const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: { isEmail: true }
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  perfil: {
    type: DataTypes.ENUM('admin', 'docente', 'estudante'),
    allowNull: false,
    defaultValue: 'estudante'
  },
  estado: {
    type: DataTypes.ENUM('pendente', 'activo', 'inactivo'),
    allowNull: false,
    defaultValue: 'pendente'
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Campo para o admin que aprovou
  aprovado_por: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  data_aprovacao: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;