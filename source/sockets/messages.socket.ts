import { Server, Socket } from 'socket.io';

export const activeUsers = {};

export const setupChatEvent = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User with userId: ${userId} socketId: ${socket.id} connected`);

    socket.on('disconnect', () => {
      console.log(`User with userId: ${userId} socketId: ${socket.id} disconnected`);
    });

    socket.on('chat', (payload) => {
      payload.socketId = socket.id;
      console.log('Payload: ', payload);
      io.emit('chat', payload);
    });
  });
};
