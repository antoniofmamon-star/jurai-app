const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publicacao = sequelize.define('Publicacao', {
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
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doi: {
    type: DataTypes.STRING,
    allowNull: true
  },
  revista: {
    type: DataTypes.STRING,
    allowNull: true
  },
  link_pdf: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'publicacoes',
  timestamps: true
});

module.exports = Publicacao;