import {Container} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {RNG} from "../game/engine/RNG.ts";
import {Reel} from "./Reel.ts";
import type {SymbolCell} from "./Reel.ts";
import {SoundManager} from "../audio/SoundManager.ts";

const ROW_STAGGER_MS = 0;

export class ReelsContainer extends Container {
    private readonly reels: Reel[] = [];
    private reelCounter: number;
    private rng: RNG;
    private isAnyDropping = false;
    private soundManager: SoundManager;
    private externalOnReelStop?: () => void;

    constructor(reelCounter: number, rng: RNG, soundManager: SoundManager) {
        super();

        this.reelCounter = reelCounter;
        this.soundManager = soundManager;
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
    };

    public async dropAll(matrix: string[][], onComplete: () => void): Promise<void> {
        this.isAnyDropping = true;

        for (const reel of this.reels) {
            reel.clearSymbols();
        }

        const rows = GAME_CONFIG.ROWS;

        for (let row = 0; row < rows; row++) {
            if (row > 0) {
                await this.delay(ROW_STAGGER_MS);
            }

            const isLastRow = row === rows - 1;

            const rowPromises = this.reels.map((reel, col) =>
                reel.dropSymbol(row, matrix[col][row]).then(() => {
                    if (isLastRow) {
                        this.soundManager.play('reelStop');
                        this.externalOnReelStop?.();
                    }
                })
            );

            await Promise.all(rowPromises);
        }

        this.isAnyDropping = false;
        onComplete();
    };

    public spinAll(matrix: string[][], onComplete: () => void): void {
        this.dropAll(matrix, onComplete);
    };

    public getIsAnySpinning(): boolean {
        return this.isAnyDropping;
    };

    public getSymbolCell(reel: number, row: number): SymbolCell | undefined {
        return this.reels[reel]?.getSymbolCell(row);
    };

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    public destroy(): void {
        for (const reel of this.reels) {
            reel.destroy();
        }
        this.reels.length = 0;
        super.destroy();
    };
}