import {Assets, Container, Sprite, Rectangle} from "pixi.js";
import {SoundManager} from "../../audio/SoundManager.ts";
import gsap from "gsap";

export class SettingsButton extends Container {
    private originalScaleX: number;
    private originalScaleY: number;
    private soundManager: SoundManager;
    private bg: Sprite;

    constructor(onClick: () => void, soundManager: SoundManager) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.soundManager = soundManager;

        const texture = Assets.get('setting_2_ml');
        this.bg = new Sprite(texture);

        this.bg.setSize(50, 50);

        this.bg.anchor.set(0.5);
        this.bg.position.set(45, 580);

        this.originalScaleX = this.bg.scale.x;
        this.originalScaleY = this.bg.scale.y;

        this.addChild(this.bg);

        this.updateHitArea();

        this.on('pointerdown', () => this.handleDown(onClick));
        this.on('pointerup', () => this.handleUp());
    };

    private handleDown(onClick: () => void): void {
        this.soundManager.play('settingsBtn');
        gsap.killTweensOf(this.bg.scale);

        gsap.to(this.bg.scale, {
            x: this.originalScaleX * 0.95,
            y: this.originalScaleY * 0.95,
            duration: 0.08,
            ease: "power2.out"
        });

        onClick();
    };

    private handleUp(): void {
        gsap.killTweensOf(this.bg.scale);

        gsap.to(this.bg.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.2,
            ease: "back.out(4)"
        });
    };

    private updateHitArea(): void {
        this.hitArea = new Rectangle(
            this.bg.x - this.bg.width / 2,
            this.bg.y - this.bg.height / 2,
            this.bg.width,
            this.bg.height
        );
    };

    public destroy(): void {
        gsap.killTweensOf(this.bg.scale);
        this.removeAllListeners();
        super.destroy();
    };

}