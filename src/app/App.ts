import {Application} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {ResolutionManager} from "../config/resolution.ts";
import {Loader} from "../config/Loader.ts";
import {GameScene} from "../scene/GameScene.ts";

export class App extends Application {
    private gameScene!: GameScene;
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

            this.gameScene = new GameScene();
            this.stage.addChild(this.gameScene);
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
}