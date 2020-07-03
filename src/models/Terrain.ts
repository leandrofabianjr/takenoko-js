export class Terrain {
    isFountain = false;
    color: 'green' | 'pink' | 'yellow';
    bamboos: number = 0;
    improvement: 'enclosure' | 'watershed' | 'fertilizer';

    addBamboo() {
        if (this.bamboos < 4) {
            this.bamboos++;
        }
    }

    removeBamboo() {
        if (this.bamboos > 0) {
            this.bamboos--;
        }
    }
}