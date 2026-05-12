const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mesa = sequelize.define('Mesa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Dados do estudante
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
  // Membros da mesa
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
  // Estado da mesa
  estado: {
    type: DataTypes.ENUM(
      'rascunho',
      'sugerido',
      'aprovado',
      'rejeitado'
    ),
    defaultValue: 'rascunho'
  },
  // Justificação da IA
  justificacao_ia: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Quem criou a mesa
  criado_por: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'mesas',
  timestamps: true
});

module.exports = Mesa;