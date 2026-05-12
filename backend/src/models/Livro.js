const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Livro = sequelize.define('Livro', {
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
  editora: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'livros',
  timestamps: true
});

module.exports = Livro;