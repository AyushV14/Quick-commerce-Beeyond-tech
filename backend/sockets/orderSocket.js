let io;

const initializeSocket = (socketIO) => {
  io = socketIO;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_room', (role) => {
      socket.join(role);
      console.log(`Socket ${socket.id} joined room: ${role}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };