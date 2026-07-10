import {Container, Assets, Sprite} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {RNG} from "../game/engine/RNG.ts";
import {WeightedSpinGenerator} from "../engine/WeightedSpinGenerator.ts";
import {ReelsContainer} from "../reels/ReelsContainer.ts";
import {UIFactory} from "../ui/UIFactory.ts";

export class GameScene extends Container {
    private reelsContainer: ReelsContainer;
    private readonly rng: RNG;
    private readonly spinGenerator: WeightedSpinGenerator;

    constructor(rng: RNG) {
        super();
        this.rng = rng;
        this.spinGenerator = new WeightedSpinGenerator(this.rng);

        this.createBackground();
        this.createFrame('reels');
        this.createGameName();
        this.reelsContainer = this.createReels();
        this.createFrame('reels_frame');

        this.showInitialSymbols();

        this.createUI();

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
            GAME_CONFIG.REELS_COUNT * GAME_CONFIG.SYMBOL_SIZE +
            (GAME_CONFIG.REELS_COUNT -1) * GAME_CONFIG.SYMBOL_GAP_X;
        const totalHeight = GAME_CONFIG.ROWS * GAME_CONFIG.SYMBOL_SIZE;

        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.position.set(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2);
        sprite.setSize(totalWidth + 20, totalHeight + 99);

        this.addChild(sprite);
    };
    //@ts-ignore
    private createSpinManager(): SpinManager {

    }

    private createReels(): ReelsContainer {
        const reels = new ReelsContainer(GAME_CONFIG.REELS_COUNT, this.rng);

        const totalWidth =
            GAME_CONFIG.REELS_COUNT * GAME_CONFIG.SYMBOL_SIZE +
            (GAME_CONFIG.REELS_COUNT - 1) * GAME_CONFIG.SYMBOL_GAP_X;
        const totalHeight = GAME_CONFIG.ROWS * GAME_CONFIG.SYMBOL_SIZE;

        reels.x = (GAME_CONFIG.WIDTH - totalWidth) / 2;
        reels.y = (GAME_CONFIG.HEIGHT - totalHeight) / 2;

        this.addChild(reels);
        return reels;
    }

    private showInitialSymbols(): void {
        const matrix = this.spinGenerator.generateMatrix();
        this.reelsContainer.showInitial(matrix);
    }

    private createUI(): void {
        const uiFactory = new UIFactory();
        const { elements } = uiFactory.createGameUI(() => this.onSpinClick());

        elements.forEach((el) => this.addChild(el));
    }

    private onSpinClick(): void {
        console.log('Spin clicked!');
    }
}