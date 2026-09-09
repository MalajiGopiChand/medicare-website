const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const { Server } = require('socket.io');

// Socket.io video room management
const videoRooms = new Map();

// Create video room
router.post('/room/create', auth, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    const roomId = `room_${appointmentId}_${Date.now()}`;
    videoRooms.set(roomId, {
      appointmentId,
      participants: [],
      createdAt: new Date()
    });
    
    res.json({ roomId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join video room
router.post('/room/join', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = videoRooms.get(roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (!room.participants.includes(req.user.userId)) {
      room.participants.push(req.user.userId);
    }
    
    res.json({ roomId, participants: room.participants.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leave video room
router.post('/room/leave', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = videoRooms.get(roomId);
    
    if (room) {
      room.participants = room.participants.filter(id => id !== req.user.userId);
      if (room.participants.length === 0) {
        videoRooms.delete(roomId);
      }
    }
    
    res.json({ message: 'Left room successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

