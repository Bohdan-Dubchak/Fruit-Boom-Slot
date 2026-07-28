import {Container} from "pixi.js";
import {SettingsPanel} from "../ui/display/settingsPanel.ts";

export class SettingPanelManager {
    private currentPanel: SettingsPanel | null = null;
    private readonly container: Container;
    private readonly gameWidth: number;
    private readonly gameHeight: number;

    constructor(gameWidth: number, gameHeight: number, container: Container) {
        this.container = container;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    };

    public show(): void {
        if (this.currentPanel) return;

        this.currentPanel = new SettingsPanel(this.gameWidth, this.gameHeight);

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