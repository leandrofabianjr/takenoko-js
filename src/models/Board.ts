import { Rand } from './../helpers/Rand';
import { TerrainSlot } from './TerrainSlot';
import { Terrain } from './Terrain';

export class Board {
    slots: TerrainSlot[][];
    size: number;

    private neighbors = {
        upLeft: { x: -1, y: 0 },
        upRight: { x: -1, y: 1 },
        left: { x: 0, y: -1 },
        right: { x: 0, y: 1 },
        bottomLeft: { x: 1, y: 0 },
        bottomRight: { x: 1, y: 1 }
    };

    constructor(size: number) {
        this.size = size;
        this.buildSlots();
        this.setFountain();
    }

    private s(pos: { x: number, y: number }): TerrainSlot {
        return this.slots[pos.x][pos.y];
    }

    private nPos(pos: { x: number, y: number }, neighbor: 'upLeft' | 'upRight' | 'left' | 'right' | 'bottomLeft' | 'bottomRight'): { x: number, y: number } {
        const n = this.neighbors[neighbor];
        const x = pos.x + n.x;
        let y = pos.y + n.y - (neighbor != 'left' && neighbor != 'right' ? pos.x % 2 : 0);
        if (this.slotExists({ x, y })) {
            return { x, y };
        }
        return null;
    }

    private nTerrain(pos: { x: number, y: number }, neighbor: 'upLeft' | 'upRight' | 'left' | 'right' | 'bottomLeft' | 'bottomRight'): Terrain {
        if (!this.slotExists(pos)) {
            return null;
        }
        const nPos = this.nPos(pos, neighbor);
        return nPos ? this.s(nPos)?.terrain : null;
    }

    private buildSlots() {
        this.slots = Array.apply(null, { length: this.size })
            .map(() => Array.apply(null, { length: this.size }));
    }

    private setFountain() {
        const x = Math.floor(this.size / 2);
        const y = x;
        const slot = new TerrainSlot(x, y, new Terrain());
        slot.terrain.isFountain = true;
        this.slots[x][y] = slot;
        this.updateNeighborsOf(x, y, true);
    }

    private updateNeighborsOf(x: number, y: number, isFountain = false) {
        // Walks through all its neighbors
        Object.keys(this.neighbors).map(k => {
            const nPos = this.nPos({ x, y }, k as any);
            if (!nPos || !this.s(nPos)) {
                // If it is a fountain, its this.s(nPosors always can be terrains
                // Else, only if there is a corner of two terrains over there
                if (isFountain || this.existsTerrainCornerInNeighborhood(nPos)) {
                    this.addSlotThatCanBeTerrain(nPos);
                }
            }
        });
    }

    /**
     * Check if there is any corner of two neighbors around this position
     * @param pos 
     */
    private existsTerrainCornerInNeighborhood(pos: { x: number, y: number }): boolean {
        return (!!this.nTerrain(pos, 'upLeft') && !!this.nTerrain(pos, 'upRight'))
            || (!!this.nTerrain(pos, 'upRight') && !!this.nTerrain(pos, 'right'))
            || (!!this.nTerrain(pos, 'right') && !!this.nTerrain(pos, 'bottomRight'))
            || (!!this.nTerrain(pos, 'bottomRight') && !!this.nTerrain(pos, 'bottomLeft'))
            || (!!this.nTerrain(pos, 'bottomLeft') && !!this.nTerrain(pos, 'left'))
            || (!!this.nTerrain(pos, 'left') && !!this.nTerrain(pos, 'upLeft'));
    }

    private slotExists(pos: { x: number, y: number }): boolean {
        return pos?.x >= 0 && pos?.x < this.size && pos?.y >= 0 && pos?.y < this.size;
    }

    private addSlotThatCanBeTerrain(pos: { x: number, y: number }) {
        let slot = this.s(pos);
        if (!slot) {
            slot = new TerrainSlot(pos.x, pos.y);
        }
        slot.canBeTerrain = true;
        this.slots[pos.x][pos.y] = slot;
    }

    getNotEmptySlots() {
        let notEmptySlots = [];
        this.slots.map(line => {
            const notEmptyLine = line.filter(s => s != null);
            if (notEmptyLine.length) {
                notEmptySlots.push(notEmptyLine);
            }
        })
        return notEmptySlots;
    }

    json() {
        return {
            size: this.size,
            // slots: this.getNotEmptySlots()
            slots: this.slots
        };
    }

    addTerrain(x: number, y: number, terrain: Terrain) {
        terrain.bamboos = Rand.integerBetween(0, 5);
        console.log(terrain.bamboos);
        this.slots[x][y].terrain = terrain;
        this.updateNeighborsOf(x, y);
    }

    terrain(pos: { x: number; y: number; }): Terrain {
        return this.slotExists(pos) ? this.s(pos).terrain : null;
    }

    private logBoard(pos: { x: number, y: number } = null) {
        let mtx = this.slots.map((line, i) => {
            let lineStr = i % 2 ? '' : ' ';
            lineStr += line
                ?.map((slot, j) => {
                    if (i == pos?.x && j == pos?.y) {
                        return 'X';
                    } else if (slot?.terrain) {
                        return slot.terrain?.isFountain ? 'O' : '#';
                    } else if (slot?.canBeTerrain) {
                        return '*'
                    }
                    return '-';
                })
                .join(' ');
            return lineStr;
        }).join("\n");
        console.log(mtx);
    }
}