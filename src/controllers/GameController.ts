import { Rand } from './../helpers/Rand';
import { Terrain } from './../models/Terrain';
import { Board } from '../models/Board';

export class GameController {
    BOARD_SIZE = 9;
    private _board: Board;

    constructor() {
        this._board = new Board(this.BOARD_SIZE);
    }

    get board() {
        return this._board.json();
    }

    addTerrain(pos: { x: number, y: number }, color: string, improvement: string) {
        console.log(color, improvement);
        const t = new Terrain();
        t.color = color as any;
        t.improvement = improvement as any;
        this._board.addTerrain(pos.x, pos.y, t);
    }

    addBamboo(pos: { x: number, y: number }) {
        this._board.terrain(pos)?.addBamboo();
    }

    getBamboo(pos: { x: number, y: number }) {
        this._board.terrain(pos)?.removeBamboo();
        // TODO push bamboo into resources player
    }
}
