import {Application} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {ResolutionManager} from "../config/resolution.ts";
import {Loader} from "../config/Loader.ts";

export class App extends Application {
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
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
}