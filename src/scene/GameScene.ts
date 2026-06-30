import {Container, Assets, Sprite} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";

export class GameScene extends Container {
    constructor() {
        super();
        this.createBackground();
        this.createFrame('reels');
        this.createGameName();
        this.createFrame('reels_frame');
    }

    private createBackground(): void {
        const texture = Assets.get('bg');
        const sprite = new Sprite(texture);

        sprite.width = GAME_CONFIG.WIDTH;
        sprite.height = GAME_CONFIG.HEIGHT;

        this.addChild(sprite);
    };

    private createGameName(): void {
        const gameName = new Sprite(Assets.get('game').textures['logo']);

        gameName.anchor.set(0.5);
        gameName.scale.set(0.80);
        gameName.position.set(540, 24);

        this.addChild(gameName);
    };

    private createFrame(textureKey: string): void {
        const texture = Assets.get(textureKey);

        if (!texture) return;

        const totalWidth =
            GAME_CONFIG.REELS_COUNT * GAME_CONFIG.SIMBOL_SIZE +
            (GAME_CONFIG.REELS_COUNT -1) * GAME_CONFIG.SYMBOL_GAP_X;
        const totalHeight = GAME_CONFIG.ROWS * GAME_CONFIG.SIMBOL_SIZE;

        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.position.set(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2);
        sprite.setSize(totalWidth + 20, totalHeight + 99);

        this.addChild(sprite);
    }
}