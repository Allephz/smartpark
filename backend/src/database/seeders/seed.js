const { User, ParkingLot, ParkingSlot } = require('../../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN'
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      username: 'user',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER'
    });

    // Create parking lots
    const parkingLots = await ParkingLot.bulkCreate([
      {
        name: 'Mall A - Floor 1',
        totalCapacity: 15,
        description: 'Ground floor parking area',
        address: 'Jl. Sudirman No. 1, Jakarta'
      },
      {
        name: 'Mall A - Floor 2',
        totalCapacity: 10,
        description: 'Upper floor parking area',
        address: 'Jl. Sudirman No. 1, Jakarta'
      }
    ]);

    // Create parking slots for each lot
    for (const lot of parkingLots) {
      const slots = [];
      for (let i = 1; i <= lot.totalCapacity; i++) {
        slots.push({
          slotNumber: `${lot.name}-${i}`,
          status: 'AVAILABLE',
          parkingLotId: lot.id
        });
      }
      await ParkingSlot.bulkCreate(slots);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Execute seeding if this file is run directly
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = seedDatabase;