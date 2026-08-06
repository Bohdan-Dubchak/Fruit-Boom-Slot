import {Application} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {ResolutionManager} from "../config/resolution.ts";
import {Loader} from "../config/Loader.ts";
import {GameScene} from "../scene/GameScene.ts";
import {RNG} from "../game/engine/RNG.ts";
import {SoundManager} from "../audio/SoundManager.ts";

export class App extends Application {
    private gameScene!: GameScene;
    private rng!: RNG;
    private soundManager: SoundManager = new SoundManager();
    async init(): Promise<void> {
        try {
            await super.init({
                width: GAME_CONFIG.WIDTH,
                height: GAME_CONFIG.HEIGHT,
                resolution: ResolutionManager.getOptimalResolution(),
                autoDensity: true,
                backgroundColor: '#000000'
            });

            document.body.appendChild(this.canvas);

            await Loader.load(() => {});
            await this.startGame();
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    public async startGame(): Promise<void> {
        this.rng = new RNG(Date.now());
        this.soundManager.play('music');
        this.gameScene = new GameScene(this.rng, this.soundManager);
        this.stage.addChild(this.gameScene);
    }
}