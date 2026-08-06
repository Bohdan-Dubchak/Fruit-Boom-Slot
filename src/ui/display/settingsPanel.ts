import {Assets, Container, Graphics, Sprite, Text} from "pixi.js";
import {SettingsManager} from "../../managers/settingsManager.ts";
import {animatePressed} from "../utils/animatePress.ts";
import {LanguageManager} from "../../managers/LanguageManager.ts";
import type {Language} from "../../managers/translations.ts";
import {SoundManager} from "../../audio/SoundManager.ts";

export class SettingsPanel extends Container {
    private backdrop!: Graphics;
    private panel!: Container;
    private closeCallback?: () => void;
    private flagIcon!: Sprite;
    private soundManager: SoundManager;
    private titleText!: Text;
    private musicLabel!: Text;
    private soundLabel!: Text;
    private fullscreenLabel!: Text;
    private languageLable!: Text;

    private readonly languageChangeCallback = (_lang: Language) => this.updateTexts();

    constructor(gameWidth: number, gameHeight: number, soundManager: SoundManager) {
        super();
        this.soundManager = soundManager;
        this.createBackdrop(gameWidth, gameHeight);
        this.createPanel();
        this.createTitle();
        this.createMusicRow();
        this.createSoundRow();
        this.createFullscreenRow();

        const flagBtn = this.createFlagButton();
        flagBtn.position.set(40, 220);
        this.panel.addChild(flagBtn);

        LanguageManager.addListener(this.languageChangeCallback);
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
        this.titleText = new Text({
            text: LanguageManager.t('settings'),
            style: {
                fontFamily: 'Alpha',
                fontSize: 32,
                fill: 0xffd700,
                fontWeight: 'bold'
            }
        });

        this.titleText.anchor.set(0.5);
        this.titleText.position.set(40, -150);
        this.panel.addChild(this.titleText);
    };

    private createMusicRow(): void {
        this.musicLabel = this.createLabel(LanguageManager.t('music'), -120, -53);
        this.panel.addChild(this.musicLabel);

        const btn = this.createToggleBtn(
            'toggle_on_m',
            'toggle_off_m',
            (isOn) => { SettingsManager.music = isOn; },
            false,
            SettingsManager.music,
        );

            this.soundManager.play('settingsBtn');

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
        this.soundLabel = this.createLabel(LanguageManager.t('sound'), -120, 40);
        this.panel.addChild(this.soundLabel);

        const btn = this.createToggleBtn(
            'sound_2',
            'sound_1',
            (isOn) => { SettingsManager.sound = isOn; },
            true,
            SettingsManager.sound
        );

        this.soundManager.play('settingsBtn')

        btn.setSize(40, 40);
        btn.position.set(40, 40);
        this.panel.addChild(btn);
    };

    private createFullscreenRow(): void {
        this.fullscreenLabel = this.createLabel(LanguageManager.t('screen'), -120, 130);
        this.panel.addChild(this.fullscreenLabel);

        const btn = this.createToggleBtn(
            'fullscreen_off',
            'fullscreen_on',
            (isOn) => { SettingsManager.fullscreen = isOn; },
            true,
            SettingsManager.fullscreen
        );

        btn.setSize(40, 40);
        btn.position.set(40, 130);
        this.panel.addChild(btn);
    };

    private createFlagButton(): Container {
        this.languageLable = this.createLabel(LanguageManager.t('language'), -120, 220);
        this.panel.addChild(this.languageLable);

        const btn = new Container();

        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        this.flagIcon = new Sprite(Assets.get(LanguageManager.getCurrentLanguage()));
        this.flagIcon.anchor.set(0.5);
        this.flagIcon.setSize(40, 40);
        this.flagIcon.position.set(0, 0);

        btn.addChild(this.flagIcon);

        btn.on('pointerdown', () => {
            const nextLang = LanguageManager.switchLanguage();
            this.flagIcon.texture = Assets.get(nextLang);
            this.soundManager.play('settingsBtn');
        });

        return btn;
    };

    private updateTexts(): void {
        this.titleText.text = LanguageManager.t('settings');
        this.musicLabel.text = LanguageManager.t('music');
        this.soundLabel.text = LanguageManager.t('sound');
        this.fullscreenLabel.text = LanguageManager.t('screen');
        this.languageLable.text = LanguageManager.t('language');
    }

    private createToggleBtn(
        textureOn: string,
        textureOff: string,
        callback: (isOn: boolean) => void,
        animate: boolean = false,
        initialState: boolean = true,
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
            this.soundManager.play('settingsBtn')
        });

        return btn;
    };

    public onClose(callback: () => void): void {
        this.closeCallback = callback;
    };

    public destroy(): void {
        LanguageManager.removeListener(this.languageChangeCallback);
        super.destroy();
    }
}