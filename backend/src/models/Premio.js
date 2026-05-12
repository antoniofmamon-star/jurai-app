const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Premio = sequelize.define('Premio', {
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
  instituicao: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'premios',
  timestamps: true
});

module.exports = Premio;