import {Assets, Container, Graphics, Sprite, Text} from "pixi.js";
import {SettingsManager} from "../../managers/settingsManager.ts";
import {animatePressed} from "../utils/animatePress.ts";

export class SettingsPanel extends Container {
    private backdrop!: Graphics;
    private panel!: Container;
    private closeCallback?: () => void;

    constructor(gameWidth: number, gameHeight: number) {
        super();
        this.createBackdrop(gameWidth, gameHeight);
        this.createPanel();
        this.createTitle();
        this.createMusicRow();
        this.createSoundRow();
        this.createFullscreenRow();
    };

    private createBackdrop(gameWidth: number, gameHeight: number) {
        this.backdrop = new Graphics();
        this.backdrop
            .rect(0, 0, gameWidth, gameHeight)
            .fill({ color: 0x000000, alpha: 0.7 })

        this.backdrop.eventMode = 'static';
        this.backdrop.cursor = 'pointer';

        this.backdrop.on('pointerdown', () => this.closeCallback?.());

        this.addChild(this.backdrop);
    };

    private createPanel(): void {
        this.panel = new Container();

        this.panel.position.set(493, 285);

        this.panel.eventMode = 'static';

        this.panel.on('pointerdown', (e) => e.stopPropagation());

        this.addChild(this.panel);

        const panelBg = new Graphics();
        panelBg.roundRect(-300, -180, 700, 500, 20);
        panelBg.fill({ color: 0x2a2a2a, alpha: 0.5 });
        panelBg.stroke({ color: 0xffd700, width: 1 });

        this.panel.addChild(panelBg);
    };

    private createTitle(): void {
        const title = new Text({
            text: 'Settings',
            style: {
                fontFamily: 'Alpha',
                fontSize: 32,
                fill: 0xffd700,
                fontWeight: 'bold'
            }
        });

        title.anchor.set(0.5);
        title.position.set(40, -150);
        this.panel.addChild(title);
    };

    private createMusicRow(): void {
        this.panel.addChild(this.createLabel('Music:', -120, -53));

        const btn = this.createToggleBtn(
            'toggle_on_m',
            'toggle_off_m',
            (isOn) => { SettingsManager.music = isOn; },
            false,
            SettingsManager.music
        );

        btn.position.set(40, -53);
        this.panel.addChild(btn)
    };

    private createLabel(text: string, x: number, y: number): Text {
        const label = new Text({
            text,
            style: { fontFamily: 'Alpha', fontSize: 25, fill: 0xffd700, fontWeight: 'bold' }
        });

        label.anchor.set(0.5);
        label.position.set(x, y);
        return label;
    };

    private createSoundRow(): void {
        this.panel.addChild(this.createLabel('Sound:', -120, 40));

        const btn = this.createToggleBtn(
            'sound_2',
            'sound_1',
            (isOn) => { SettingsManager.sound = isOn; },
            true,
            SettingsManager.sound
        );

        btn.setSize(40, 40);
        btn.position.set(40, 40);
        this.panel.addChild(btn);
    };

    private createFullscreenRow(): void {
        this.panel.addChild(this.createLabel('Full Screen:', -120, 130));

      const btn = this.createToggleBtn(
          'fullscreen_off',
          'fullscreen_on',
          (isOn) => {
              SettingsManager.fullscreen = isOn;

          },
          true,
          SettingsManager.fullscreen
      );

        btn.setSize(40, 40);
        btn.position.set(40, 130);
        this.panel.addChild(btn);
    };

    private createToggleBtn(
        textureOn: string,
        textureOff: string,
        callback: (isOn: boolean) => void,
        animate: boolean = false,
        initialState: boolean = true
    ): Container {
        const btn = new Container();

        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        let isOn: boolean = initialState;

        const bg = new Sprite(Assets.get(isOn ? textureOn : textureOff));

        bg.anchor.set(0.5);
        bg.setSize(60, 30);
        btn.addChild(bg);

        btn.on('pointerdown', () => {
            if (animate) {
                animatePressed(bg)
            }
            isOn = !isOn;
            bg.texture = Assets.get(isOn ? textureOn : textureOff);
            callback(isOn);
        });

        return btn;
    };

    public onClose(callback: () => void): void {
        this.closeCallback = callback;
    };
}
