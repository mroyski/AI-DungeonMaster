const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/RoomController');

router.get('/', RoomController.getAllRooms.bind(RoomController));
router.post('/', RoomController.createRoom.bind(RoomController));
router.get('/:id', RoomController.getRoomById.bind(RoomController));
router.delete('/:id', RoomController.deleteRoom.bind(RoomController));

module.exports = router;