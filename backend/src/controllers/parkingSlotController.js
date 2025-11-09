const { ParkingSlot } = require('../models');

// Update slot status
const updateSlotStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const slot = await ParkingSlot.findByPk(id);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    if (!['AVAILABLE', 'OCCUPIED', 'RESERVED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await slot.update({ status });

    // Emit socket event for real-time updates
    req.io.emit('slotStatusUpdate', {
      slotId: slot.id,
      status: slot.status,
      parkingLotId: slot.parkingLotId
    });

    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: 'Error updating slot status' });
  }
};

// Get all slots for a parking lot
const getSlotsByLot = async (req, res) => {
  try {
    const { parkingLotId } = req.params;
    const slots = await ParkingSlot.findAll({
      where: { parkingLotId },
      order: [['slotNumber', 'ASC']]
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slots' });
  }
};

module.exports = {
  updateSlotStatus,
  getSlotsByLot
};