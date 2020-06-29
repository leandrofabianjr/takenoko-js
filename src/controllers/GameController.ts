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

    addTerrain(pos: { x: number, y: number }, color: string) {
        const t = new Terrain();
        t.color = color;
        this._board.addTerrain(pos.x, pos.y, t);
    }
}
