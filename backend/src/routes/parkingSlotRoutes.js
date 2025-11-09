const express = require('express');
const router = express.Router();
const parkingSlotController = require('../controllers/parkingSlotController');
const { auth, isAdmin } = require('../middlewares/auth');

router.get('/lot/:parkingLotId', auth, parkingSlotController.getSlotsByLot);
router.put('/:id/status', auth, isAdmin, parkingSlotController.updateSlotStatus);

module.exports = router;