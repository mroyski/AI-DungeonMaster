const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/PlayerController');

router.get('/:userId/players', PlayerController.getPlayersByUserId.bind(PlayerController));
router.post('/:userId/players', PlayerController.createPlayer.bind(PlayerController));

module.exports = router;