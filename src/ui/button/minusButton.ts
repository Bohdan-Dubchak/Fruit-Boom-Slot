import {Assets, Container, Rectangle, Sprite,} from "pixi.js";
import gsap from "gsap";

export class MinusBet extends Container {
    private originalScaleX: number;
    private originalScaleY: number;
    private bg: Sprite;

    constructor() {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        const texture = Assets.get('arrow_left');
        this.bg = new Sprite(texture);

        this.bg.position.set(455, 650);
        this.bg.anchor.set(0.5);

        this.bg.setSize(44, 47);

        this.originalScaleX = this.bg.scale.x;
        this.originalScaleY = this.bg.scale.y;

        this.addChild(this.bg);

        this.updateHitArea();

        this.on('pointerdown', () => this.handleDown());
        this.on('pointerup', () => this.handleUp());
    };

    private handleDown(): void {
        gsap.killTweensOf(this.bg.scale);

        gsap.to(this.bg.scale, {
            x: this.originalScaleX * 0.95,
            y: this.originalScaleY * 0.95,
            duration: 0.08,
            ease: "power2.out"
        });
    };

    private handleUp(): void {
        gsap.killTweensOf(this.bg.scale);

        gsap.to(this.bg.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.2,
            ease: "back.out(4)"
        });
    }

    private updateHitArea(): void {
        this.hitArea = new Rectangle(
            this.bg.x - this.bg.width / 2,
            this.bg.y - this.bg.height / 2,
            this.bg.width,
            this.bg.height
        );
    }

    public destroy(): void {
        gsap.killTweensOf(this.bg.scale);
        this.removeAllListeners();
        super.destroy();
    }
}