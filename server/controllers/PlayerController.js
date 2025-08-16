const BaseController = require('./BaseController');
const Player = require('../models/player');
const PlayerClass = require('../models/playerClass');

class PlayerController extends BaseController {
  async getPlayersByUserId(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return this.badRequest(res, 'User ID is required');
      }

      const players = await Player.find({ user: userId }).populate('playerClass');
      return this.success(res, players);
    } catch (error) {
      console.error('Get players error:', error);
      return this.serverError(res, 'Failed to fetch players');
    }
  }

  async createPlayer(req, res) {
    try {
      const { userId } = req.params;
      const { name, playerClass } = req.body;

      if (!name || !playerClass) {
        return this.badRequest(res, 'Player name and class are required');
      }

      const playerClassModel = await PlayerClass.findOne({ name: playerClass });
      if (!playerClassModel) {
        return this.notFound(res, 'Player class not found');
      }

      const player = await new Player({
        name,
        user: userId,
        playerClass: playerClassModel,
      }).save();

      return this.created(res, player, 'Player created successfully');
    } catch (error) {
      console.error('Create player error:', error);
      return this.serverError(res, 'Error creating player');
    }
  }
}

module.exports = new PlayerController();