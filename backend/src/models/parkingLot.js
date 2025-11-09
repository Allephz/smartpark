const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const ParkingLot = sequelize.define('ParkingLot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ParkingLot;