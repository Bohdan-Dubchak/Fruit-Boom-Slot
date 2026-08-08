import {Application, Assets} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {ResolutionManager} from "../config/resolution.ts";
import {Loader} from "../config/Loader.ts";
import {GameScene} from "../scene/GameScene.ts";
import {RNG} from "../game/engine/RNG.ts";
import {SoundManager} from "../audio/SoundManager.ts";
import {LoadingScene} from "../scene/LoadingScene.ts";

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

            await Assets.load({ alias: 'loading', src: '/images/background/Loading.webp' });

            await new Promise<void>((resolve) => {
                const loadingScene = new LoadingScene(() => {
                    this.stage.removeChild(loadingScene);
                    loadingScene.destroy();
                    resolve();
                });

                this.stage.addChild(loadingScene);

                Loader.load((progress) => {
                    loadingScene.updateProgress(progress);
                });
            });

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