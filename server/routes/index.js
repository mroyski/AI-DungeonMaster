const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const roomRoutes = require('./rooms');
const playerRoutes = require('./players');

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/users', playerRoutes);

module.exports = router;