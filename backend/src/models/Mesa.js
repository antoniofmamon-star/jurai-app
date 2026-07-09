const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mesa = sequelize.define('Mesa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_estudante: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tema: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  curso: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ano: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data_defesa: {
    type: DataTypes.DATE,
    allowNull: true
  },
  hora_defesa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  local_defesa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  presidente: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Aguardando sugestão da IA'
  },
  primeiro_vogal: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Aguardando sugestão da IA'
  },
  suplente: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Aguardando sugestão da IA'
  },
  segundo_vogal_tutor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  secretario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'rascunho'
  },
  justificacao_ia: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  criado_por: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'mesas',
  timestamps: true
});

module.exports = Mesa;