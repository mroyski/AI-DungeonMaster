const BaseController = require('./BaseController');
const Room = require('../models/room');
const Player = require('../models/player');

class RoomController extends BaseController {
  async getAllRooms(req, res) {
    try {
      const rooms = await Room.find().populate('owner', 'name');
      const formattedRooms = rooms.map(room => ({
        id: room._id.toString(),
        name: room.name,
        owner: room.owner ? room.owner.name : 'Unknown',
        ownerId: room.owner ? room.owner._id.toString() : null,
        inProgress: room.inProgress
      }));
      
      return this.success(res, formattedRooms);
    } catch (error) {
      console.error('Get rooms error:', error);
      return this.serverError(res, 'Failed to fetch rooms');
    }
  }

  async createRoom(req, res) {
    try {
      const { name, playerId } = req.body;
      
      if (!name || !playerId) {
        return this.badRequest(res, 'Room name and player ID required');
      }
      
      const player = await Player.findById(playerId);
      if (!player) {
        return this.notFound(res, 'Player not found');
      }
      
      const room = new Room({
        name: name.trim(),
        owner: player._id,
        players: [player._id],
      });
      
      await room.save();
      await room.populate('owner');
      
      const roomData = {
        id: room._id.toString(),
        name: room.name,
        owner: room.owner.name,
        ownerId: room.owner._id.toString(),
        inProgress: room.inProgress
      };
      
      req.io?.emit('room created', roomData);
      
      return this.created(res, roomData, 'Room created successfully');
    } catch (error) {
      console.error('Room creation error:', error);
      return this.serverError(res, 'Failed to create room');
    }
  }

  async getRoomById(req, res) {
    try {
      const { id } = req.params;
      const room = await Room.findById(id).populate('owner players');
      
      if (!room) {
        return this.notFound(res, 'Room not found');
      }
      
      return this.success(res, room);
    } catch (error) {
      console.error('Get room error:', error);
      return this.serverError(res, 'Failed to fetch room');
    }
  }

  async deleteRoom(req, res) {
    try {
      const { id } = req.params;
      const { playerId } = req.body;
      
      const room = await Room.findById(id);
      if (!room) {
        return this.notFound(res, 'Room not found');
      }
      
      // Check if player is owner
      if (room.owner.toString() !== playerId) {
        return res.status(403).json({
          success: false,
          message: 'Only room owner can delete the room'
        });
      }
      
      await Room.findByIdAndDelete(id);
      req.io?.emit('room deleted', { id });
      
      return this.success(res, null, 'Room deleted successfully');
    } catch (error) {
      console.error('Delete room error:', error);
      return this.serverError(res, 'Failed to delete room');
    }
  }
}

module.exports = new RoomController();