// POST booking baru oleh user
exports.createBooking = async (req, res) => {
  try {
    const { slot_id, parkingLotId } = req.body;
    // Cek slot tersedia
    const slot = await ParkingSlot.findByPk(slot_id);
    if (!slot) return res.status(404).json({ message: 'Slot tidak ditemukan' });
    if (slot.status !== 'AVAILABLE') return res.status(400).json({ message: 'Slot tidak tersedia' });

    // Validasi: user hanya boleh punya 1 booking aktif (RESERVED/OCCUPIED)
    const activeBooking = await Booking.findOne({
      where: {
        user_id: req.user.id,
        status: ['RESERVED', 'OCCUPIED'],
      },
    });
    if (activeBooking) {
      return res.status(400).json({ message: 'Anda sudah memiliki booking aktif. Batalkan booking sebelumnya untuk booking slot baru.' });
    }

    // Buat booking dengan status 'RESERVED'
    const booking = await Booking.create({
      user_id: req.user.id,
      slot_id,
      parkingLotId,
      status: 'RESERVED',
    });

    // Update status slot menjadi 'OCCUPIED' (slot tidak bisa dibooking lagi)
    slot.status = 'OCCUPIED';
    await slot.save();

    // Booking tetap berstatus 'RESERVED' sampai user membatalkan atau menyelesaikan
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal melakukan booking', error: err.message });
  }
};
// GET bookings milik user yang sedang login
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: ParkingLot, as: 'lot', attributes: ['id', 'name'] },
        { model: ParkingSlot, as: 'slot', attributes: ['id', 'slotNumber'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(bookings);
  } catch (err) {
    console.error('Error getMyBookings:', err);
    res.status(500).json({ message: 'Gagal mengambil riwayat booking', error: err.message });
  }
};

// PUT batalkan booking milik user sendiri
// PUT check-in booking (ubah status jadi OCCUPIED)
exports.checkInBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
    if (booking.user_id !== req.user.id) return res.status(403).json({ message: 'Tidak boleh check-in booking milik orang lain' });
    if (booking.status !== 'RESERVED') return res.status(400).json({ message: 'Booking harus berstatus RESERVED untuk check-in' });
    booking.status = 'OCCUPIED';
    await booking.save();
    // Update slot status
    const slot = await ParkingSlot.findByPk(booking.slot_id);
    if (slot) {
      slot.status = 'OCCUPIED';
      await slot.save();
    }
    res.json({ message: 'Check-in berhasil', booking });
  } catch (err) {
    res.status(500).json({ message: 'Gagal check-in', error: err.message });
  }
};

// PUT check-out booking (ubah status jadi COMPLETED dan slot AVAILABLE)
exports.checkOutBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
    if (booking.user_id !== req.user.id) return res.status(403).json({ message: 'Tidak boleh check-out booking milik orang lain' });
    if (booking.status !== 'OCCUPIED') return res.status(400).json({ message: 'Booking harus berstatus OCCUPIED untuk check-out' });
    booking.status = 'COMPLETED';
    await booking.save();
    // Update slot status
    const slot = await ParkingSlot.findByPk(booking.slot_id);
    if (slot) {
      slot.status = 'AVAILABLE';
      await slot.save();
    }
    res.json({ message: 'Check-out berhasil', booking });
  } catch (err) {
    res.status(500).json({ message: 'Gagal check-out', error: err.message });
  }
};
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
    if (booking.user_id !== req.user.id) return res.status(403).json({ message: 'Tidak boleh membatalkan booking milik orang lain' });
    if (booking.status !== 'RESERVED') return res.status(400).json({ message: 'Booking tidak bisa dibatalkan' });
    booking.status = 'CANCELLED';
    await booking.save();
    res.json({ message: 'Booking berhasil dibatalkan' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membatalkan booking', error: err.message });
  }
};
const { Booking, User, ParkingLot, ParkingSlot } = require('../models');

// GET all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: ParkingLot, as: 'lot', attributes: ['id', 'name'] },
        { model: ParkingSlot, as: 'slot', attributes: ['id', 'slotNumber'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(bookings);
  } catch (err) {
    console.error('Error getAllBookings:', err);
    res.status(500).json({ message: 'Gagal mengambil data booking', error: err.message });
  }
};

// DELETE a booking (admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
    await booking.destroy();
    res.json({ message: 'Booking berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus booking', error: err.message });
  }
};
