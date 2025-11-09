const User = require('./user');
const ParkingLot = require('./parkingLot');
const ParkingSlot = require('./parkingSlot');
const Booking = require('./booking');

// ParkingLot - ParkingSlot associations
ParkingLot.hasMany(ParkingSlot, {
  foreignKey: 'parkingLotId',
  as: 'slots',
});
ParkingSlot.belongsTo(ParkingLot, {
  foreignKey: 'parkingLotId',
  as: 'parkingLot',
});

// Booking associations
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ParkingSlot.hasMany(Booking, { foreignKey: 'slot_id', as: 'bookings' });
Booking.belongsTo(ParkingSlot, { foreignKey: 'slot_id', as: 'slot' });
// Booking to ParkingLot (through slot)
ParkingLot.hasMany(Booking, { foreignKey: 'parkingLotId', as: 'bookings' });
Booking.belongsTo(ParkingLot, { foreignKey: 'parkingLotId', as: 'lot' });

module.exports = {
  User,
  ParkingLot,
  ParkingSlot,
  Booking,
};