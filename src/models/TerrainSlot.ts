import { Terrain } from "./Terrain";

export class TerrainSlot {
    position: { x: number; y: number }
    terrain: Terrain;
    canBeTerrain: boolean;

    constructor(
        x: number,
        y: number,
        terrain: Terrain = null
    ) {
        this.position = { x, y };
        this.terrain = terrain;
    }
}
