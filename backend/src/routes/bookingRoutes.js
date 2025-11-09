const express = require('express');
const router = express.Router();

const { auth, isAdmin } = require('../middlewares/auth');
const { getAllBookings, deleteBooking, getMyBookings, cancelBooking, createBooking, checkInBooking, checkOutBooking } = require('../controllers/bookingController');

// POST /api/bookings - user booking slot
router.post('/', auth, createBooking);

// GET /api/bookings - admin only
router.get('/', auth, isAdmin, getAllBookings);

// GET /api/bookings/my - user: riwayat booking sendiri
router.get('/my', auth, getMyBookings);


// PUT /api/bookings/:id/cancel - user: batalkan booking sendiri
router.put('/:id/cancel', auth, cancelBooking);

// PUT /api/bookings/:id/checkin - user: check-in booking sendiri
router.put('/:id/checkin', auth, checkInBooking);

// PUT /api/bookings/:id/checkout - user: check-out booking sendiri
router.put('/:id/checkout', auth, checkOutBooking);

// DELETE /api/bookings/:id - admin only
router.delete('/:id', auth, isAdmin, deleteBooking);

module.exports = router;
