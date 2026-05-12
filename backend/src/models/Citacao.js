const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Citacao = sequelize.define('Citacao', {
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
  autores: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fonte: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'citacoes',
  timestamps: true
});

module.exports = Citacao;