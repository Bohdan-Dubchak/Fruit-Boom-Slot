import {RNG} from "../game/engine/RNG.ts";
import {GAME_CONFIG} from "../config/game.ts";
import {SYMBOLS_IDS} from "../constants/symbols.ts";

export class WeightedSpinGenerator {
    private rng: RNG;
    private pull: string[] = [];

    constructor(rng: RNG) {
        this.rng = rng;
        this.buildPool();
    };

    private buildPool(): void {
        for (const [id, weight] of Object.entries(SYMBOLS_IDS)) {
            for (let w = 0; w < weight; w++) {
                this.pull.push(id);
            }
        }
    };

    public getRandomSymbol(): string {
        const index = Math.floor(this.rng.next() * this.pull.length);
        return this.pull[index];
    };

    public generateMatrix(): string[][] {
        const matrix: string[][] = [];

        for (let r = 0; r < GAME_CONFIG.REELS_COUNT; r++) {
            const column: string[] = [];
            for (let row = 0; row < GAME_CONFIG.ROWS; row++) {
                column.push(this.getRandomSymbol());
            }

            matrix.push(column)
        }
        return matrix;
    };
}