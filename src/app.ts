import { Rand } from './helpers/Rand';
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
        const color = ['green', 'pink', 'yellow'][Rand.integerBetween(0, 3)];
        const improvement = ['fertilizer', 'watershed', 'enclosure'][Rand.integerBetween(0, 3)];
        game.addTerrain(pos, color, improvement);
        io.emit('board', game.board);
    });

    socket.on('board add bamboo', (pos) => {
        console.log('board add bamboo');
        game.addBamboo(pos);
        io.emit('board', game.board);
    });

    socket.on('board get bamboo', (pos) => {
        console.log('board get bamboo');
        game.getBamboo(pos);
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
