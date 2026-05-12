const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Formacao = sequelize.define('Formacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  instituicao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  curso: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grau: {
    type: DataTypes.ENUM('Licenciatura', 'Mestrado', 'Doutoramento', 'Pós-Doutoramento', 'Outro'),
    allowNull: false
  },
  ano_inicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ano_fim: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'formacoes',
  timestamps: true
});

module.exports = Formacao;