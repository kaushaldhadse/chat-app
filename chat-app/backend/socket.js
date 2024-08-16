const users = {};

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');
        
        socket.on('join', ({ username }) => {
            users[socket.id] = username;
            io.emit('userConnected', { username });
        });

        socket.on('message', ({ message }) => {
            io.emit('message', { username: users[socket.id], message });
        });

        socket.on('disconnect', () => {
            io.emit('userDisconnected', { username: users[socket.id] });
            delete users[socket.id];
        });
    });
};

module.exports = socketHandler;
