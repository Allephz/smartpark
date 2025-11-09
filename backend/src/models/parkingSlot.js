const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const ParkingSlot = sequelize.define('ParkingSlot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slotNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED'),
    defaultValue: 'AVAILABLE',
  },
  parkingLotId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ParkingLots',
      key: 'id',
    },
  },
});

module.exports = ParkingSlot;