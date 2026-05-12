const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Projeto = sequelize.define('Projeto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ano_inicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ano_fim: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  financiador: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'projetos',
  timestamps: true
});

module.exports = Projeto;