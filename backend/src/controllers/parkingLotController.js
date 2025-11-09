// Statistik okupansi untuk dashboard admin
const getStatistics = async (req, res) => {
  try {
    const parkingLots = await ParkingLot.findAll({
      include: [{ model: ParkingSlot, as: 'slots', attributes: ['status'] }]
    });
    let totalSlots = 0;
    let totalOccupied = 0;
    const lotStats = parkingLots.map(lot => {
      const occupied = lot.slots.filter(slot => slot.status === 'OCCUPIED').length;
      totalSlots += lot.slots.length;
      totalOccupied += occupied;
      return {
        name: lot.name,
        total: lot.slots.length,
        occupied,
        percent: lot.slots.length ? Math.round((occupied / lot.slots.length) * 100) : 0
      };
    });
    res.json({
      lots: lotStats,
      totalSlots,
      totalOccupied,
      totalPercent: totalSlots ? Math.round((totalOccupied / totalSlots) * 100) : 0
    });
  } catch (error) {
      console.error('getStatistics error:', error);
      res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};
const { ParkingLot, ParkingSlot } = require('../models');

// Create a new parking lot
const createParkingLot = async (req, res) => {
  try {
    const { name, totalCapacity, description, address } = req.body;
    
    const parkingLot = await ParkingLot.create({
      name,
      totalCapacity,
      description,
      address
    });

    // Create parking slots for this lot
    const slots = [];
    for (let i = 1; i <= totalCapacity; i++) {
      slots.push({
        slotNumber: `${name}-${i}`,
        status: 'AVAILABLE',
        parkingLotId: parkingLot.id
      });
    }
    await ParkingSlot.bulkCreate(slots);

    res.status(201).json(parkingLot);
  } catch (error) {
     console.error('createParkingLot error:', error);
     res.status(500).json({ message: 'Error creating parking lot', error: error.message });
  }
};

// Get all parking lots with available slots count
const getAllParkingLots = async (req, res) => {
  try {
    const parkingLots = await ParkingLot.findAll({
      include: [{
        model: ParkingSlot,
        as: 'slots',
        attributes: ['status']
      }]
    });

    const lotsWithAvailability = parkingLots.map(lot => {
      const availableSlots = lot.slots.filter(slot => slot.status === 'AVAILABLE').length;
      return {
        id: lot.id,
        name: lot.name,
        totalCapacity: lot.totalCapacity,
        description: lot.description,
        address: lot.address,
        availableSlots,
        availability: `${availableSlots}/${lot.totalCapacity} available`
      };
    });

    res.json(lotsWithAvailability);
  } catch (error) {
     console.error('getAllParkingLots error:', error);
     res.status(500).json({ message: 'Error fetching parking lots', error: error.message });
  }
};

// Get single parking lot with all its slots
const getParkingLot = async (req, res) => {
  try {
    const { id } = req.params;
    const parkingLot = await ParkingLot.findByPk(id, {
      include: [{
        model: ParkingSlot,
        as: 'slots'
      }]
    });

    if (!parkingLot) {
      return res.status(404).json({ message: 'Parking lot not found' });
    }

    res.json(parkingLot);
  } catch (error) {
     console.error('getParkingLot error:', error);
     res.status(500).json({ message: 'Error fetching parking lot', error: error.message });
  }
};

// Update parking lot
const updateParkingLot = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address, totalCapacity } = req.body;

    const parkingLot = await ParkingLot.findByPk(id, { include: [{ model: ParkingSlot, as: 'slots' }] });
    if (!parkingLot) {
      return res.status(404).json({ message: 'Parking lot not found' });
    }

    // Update basic info
    await parkingLot.update({ name, description, address });

    // Update totalCapacity jika diberikan
    if (typeof totalCapacity !== 'undefined' && Number.isInteger(Number(totalCapacity))) {
      const newCapacity = Number(totalCapacity);
      const oldCapacity = parkingLot.totalCapacity;
      await parkingLot.update({ totalCapacity: newCapacity });

      // Tambah slot jika kapasitas baru lebih besar
      if (newCapacity > oldCapacity) {
        const slotsToAdd = newCapacity - oldCapacity;
        const slots = [];
        for (let i = oldCapacity + 1; i <= newCapacity; i++) {
          slots.push({
            slotNumber: `${parkingLot.name}-${i}`,
            status: 'AVAILABLE',
            parkingLotId: parkingLot.id
          });
        }
        await ParkingSlot.bulkCreate(slots);
      }
      // Hapus slot jika kapasitas baru lebih kecil
      if (newCapacity < oldCapacity) {
        // Cari slot yang akan dihapus (slot terakhir)
        const slotsToDelete = parkingLot.slots
          .filter(slot => {
            const num = parseInt(slot.slotNumber.split('-').pop());
            return num > newCapacity;
          });
        // Pastikan slot yang akan dihapus statusnya AVAILABLE
        for (const slot of slotsToDelete) {
          if (slot.status === 'AVAILABLE') {
            await slot.destroy();
          }
        }
      }
    }
    res.json(parkingLot);
  } catch (error) {
     console.error('updateParkingLot error:', error);
     res.status(500).json({ message: 'Error updating parking lot', error: error.message });
  }
};

// Delete parking lot
const deleteParkingLot = async (req, res) => {
  try {
    const { id } = req.params;
    const parkingLot = await ParkingLot.findByPk(id);
    
    if (!parkingLot) {
      return res.status(404).json({ message: 'Parking lot not found' });
    }

    await ParkingSlot.destroy({ where: { parkingLotId: id } });
    await parkingLot.destroy();
    
    res.json({ message: 'Parking lot deleted successfully' });
  } catch (error) {
     console.error('deleteParkingLot error:', error);
     res.status(500).json({ message: 'Error deleting parking lot', error: error.message });
  }
};

module.exports = {
  createParkingLot,
  getAllParkingLots,
  getParkingLot,
  updateParkingLot,
  deleteParkingLot,
  getStatistics
};