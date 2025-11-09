const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  slot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('RESERVED', 'OCCUPIED', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'RESERVED',
  },
  parkingLotId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ParkingLots',
      key: 'id',
    },
  },
});

module.exports = Booking;
