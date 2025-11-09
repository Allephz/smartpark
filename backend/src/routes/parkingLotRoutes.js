const express = require('express');
const router = express.Router();
const parkingLotController = require('../controllers/parkingLotController');
const { auth, isAdmin } = require('../middlewares/auth');


// Public routes
router.get('/statistics', auth, isAdmin, parkingLotController.getStatistics); // <-- Pindahkan ke atas
router.get('/', auth, parkingLotController.getAllParkingLots);
router.get('/:id', auth, parkingLotController.getParkingLot);

// Admin only routes
router.post('/', auth, isAdmin, parkingLotController.createParkingLot);
router.put('/:id', auth, isAdmin, parkingLotController.updateParkingLot);
router.delete('/:id', auth, isAdmin, parkingLotController.deleteParkingLot);

module.exports = router;