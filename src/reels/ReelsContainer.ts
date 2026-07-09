import {Container} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {RNG} from "../game/engine/RNG.ts";
import {Reel} from "./Reel.ts";

export class ReelsContainer extends Container {
    private readonly reels: Reel[] = [];
    private reelCounter: number;
    private rng: RNG;

    constructor(reelCounter: number, rng: RNG) {
        super();

        this.reelCounter = reelCounter;
        this.rng = rng;
        this.createReel();
    };

    private createReel(): void {
        for (let i = 0; i < this.reelCounter; i++) {
            const reel = new Reel(this.rng);
            reel.init();
            reel.x = i * (GAME_CONFIG.SYMBOL_SIZE + GAME_CONFIG.SYMBOL_GAP_X);
            this.reels.push(reel);
            this.addChild(reel);
        }
    };

    public showInitial(matrix: string[][]): void {
        this.reels.forEach((reel, col) => {
            for (let row = 0; row < GAME_CONFIG.ROWS; row++) {
                reel.showSymbol(row, matrix[col][row]);
            }
        });
    }
}