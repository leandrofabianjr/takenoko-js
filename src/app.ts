import { GameController } from './controllers/GameController';
import app from 'express';
import http from 'http';
import socketIo from 'socket.io';

const grid = [];

const server = new http.Server(app);
const io = socketIo(server);

let game: GameController;

io.on('connection', (socket) => {
    console.log('Um usuário conectado');

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });

    socket.on('start', () => {
        console.log('board');
        game = game ?? new GameController();
        io.emit('board', game.board);
    });

    socket.on('board add terrain', (pos) => {
        console.log('board add terrain');
        game.addTerrain(pos, 'pink');
        io.emit('board', game.board);
    });

    socket.on('grid update', (g) => {
        console.log('recebido', g);
        io.emit('grid updated', [3, 4, 5]);
    });
});

server.listen(4444, () => {
    console.log('Listening on port 4444');
});
