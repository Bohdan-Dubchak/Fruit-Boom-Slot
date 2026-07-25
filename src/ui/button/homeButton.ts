import {Assets, Container, Sprite} from "pixi.js";
import gsap from "gsap";

export class HomeButton extends Container {
    private originalScaleX: number;
    private originalScaleY: number;
    private readonly url: string;
    private bg: Sprite;

    constructor(url: string) {
        super();
        this.url = url;

        this.eventMode = "static";
        this.cursor = "pointer";

        const texture = Assets.get('home_ml');
        this.bg = new Sprite(texture);

        this.bg.anchor.set(0.5);
        this.bg.position.set(1035, 40);

        this.originalScaleX = this.bg.scale.x;
        this.originalScaleY = this.bg.scale.y;

        this.on('pointerdown', () => this.handleDown());
        this.on('pointerup', () => this.handleUp());

        this.addChild(this.bg);
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

        window.open(this.url, '_blank');
    };

    public override destroy(options?: any): void {
        gsap.killTweensOf(this.bg.scale);
        this.removeAllListeners();
        super.destroy(options);
    };
}