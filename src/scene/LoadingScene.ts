import {Assets, Container, Graphics, Sprite, Text} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";

export class LoadingScene extends Container {
    private progressBar: Graphics;
    private progressText: Text;
    private playButton: Container;
    private readonly barWidth: number = 800;
    private readonly barY: number = 622;

    constructor(onStart: () => void) {
        super();

        const texture = Assets.get('loading')
        const bg = new Sprite(texture);

        bg.anchor.set(0.5);
        bg.setSize(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
        bg.position.set(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2);

        const barBg = new Graphics();
        barBg.roundRect(
            GAME_CONFIG.WIDTH / 2 - this.barWidth / 2,
            this.barY, this.barWidth,
            20, 10
        );

        barBg.fill({color: 0x333333});
        this.addChild(bg)
        this.addChild(barBg);

        this.progressBar = new Graphics();
        this.addChild(this.progressBar);

        this.progressText = new Text({
            text: '0%',
            style: {
                fontFamily: "Viga",
                fontSize: 24,
                fill: "#ffd700",
            }
        });

        this.progressText.anchor.set(0.5);
        this.progressText.position.set(GAME_CONFIG.WIDTH / 2, this.barY - 15);
        this.addChild(this.progressText);

        this.playButton = this.createPlayButton(onStart);
        this.addChild(this.playButton);

        this.updateProgress(0);
    };

    private createPlayButton(onStart: () => void): Container {
        const button = new Container();

        const bg = new Graphics();
        bg.roundRect(-100, -30, 200, 60, 12);
        bg.fill({color: "#8a2310"});

        const label = new Text({
            text: 'Play',
            style: {
                fontFamily: "Viga",
                fontSize: 38,
                fill: "#d6bf3c",
            }
        });
        label.anchor.set(0.5);

        button.addChild(bg);
        button.addChild(label);

        button.position.set(GAME_CONFIG.WIDTH / 2, this.barY + 55);

        button.eventMode = 'static';
        button.cursor = 'pointer';
        button.visible = false;

        button.on('pointertap', () => {
            onStart();
        });

        return button;
    };

    public updateProgress(progress: number): void {
        const percent = Math.round(progress * 100);
        this.progressText.text = `${percent}%`;

        this.progressBar.clear();
        this.progressBar.roundRect(
            GAME_CONFIG.WIDTH / 2 - this.barWidth / 2,
            this.barY,
            this.barWidth * progress, 20, 10
        );
        this.progressBar.fill({color: "#04cf06"});

        this.playButton.visible = percent >= 100;
    };
}