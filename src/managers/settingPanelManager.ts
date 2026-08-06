import {Container} from "pixi.js";
import {SettingsPanel} from "../ui/display/settingsPanel.ts";
import {SoundManager} from "../audio/SoundManager.ts";

export class SettingPanelManager {
    private currentPanel: SettingsPanel | null = null;
    private readonly container: Container;
    private readonly gameWidth: number;
    private readonly gameHeight: number;
    private soundManager: SoundManager;

    constructor(gameWidth: number, gameHeight: number, container: Container, soundManager: SoundManager) {
        this.container = container;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.soundManager = soundManager;
    };

    public show(): void {
        if (this.currentPanel) return;

        this.currentPanel = new SettingsPanel(this.gameWidth, this.gameHeight, this.soundManager);

        this.currentPanel.onClose(() => {
            if (this.currentPanel) {
                this.container.removeChild(this.currentPanel);
                this.currentPanel = null;
            }
        });

        this.container.addChild(this.currentPanel);
    };

    public destroy(): void {
        if (this.currentPanel) {
            this.container.removeChild(this.currentPanel);
            this.currentPanel.destroy();
            this.currentPanel = null;
        }
    };
}