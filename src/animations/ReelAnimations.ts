import {Container} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";

export class ReelAnimations {
    private symbolsContainer: Container;
    private maxStretch: number = 0.40;

    constructor(symbolsContainer: Container) {
        this.symbolsContainer = symbolsContainer;
    };

    public update(speed: number, maxSpeed: number): void {
        const ration = Math.min(speed / maxSpeed, 1);

        const scaleY = 1 + ration * this.maxStretch;
        const scaleX = 1 - ration * (this.maxStretch * 0.25);

        this.symbolsContainer.scale.set(scaleX, scaleY);

        const maskWidth = GAME_CONFIG.SYMBOL_SIZE;
        const maskHeight = GAME_CONFIG.SYMBOL_SIZE * GAME_CONFIG.ROWS;

        this.symbolsContainer.x = (maskWidth - maskWidth * scaleX) / 2;
        this.symbolsContainer.y = (maskHeight - maskHeight * scaleY) / 2;
    };
}