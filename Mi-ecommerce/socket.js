const socketIO = require('socket.io');

const socket = {};

function connect(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Socket client connected');
    socket.on('disconnect', () => {
      console.log('Socket client disconnected');
    });
    socket.emit('bienvenido', { ofertas: 'Bienvenido al Servidor' });
  });
  socket.io = io;
}

module.exports = {  
  connect,
  socket,
};
