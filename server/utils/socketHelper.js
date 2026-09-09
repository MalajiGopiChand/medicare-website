// Helper to emit notifications via Socket.io
exports.emitNotification = (io, userId, notification) => {
  io.to(`user-${userId}`).emit('notification', notification);
};

