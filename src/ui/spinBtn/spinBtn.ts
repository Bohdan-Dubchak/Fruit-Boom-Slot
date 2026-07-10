import {Container, Sprite, Assets} from "pixi.js";
import gsap from "gsap";

export class SpinButton extends Container {
    private originalScaleX: number;
    private originalScaleY: number;
    private sprite: Sprite;
    private onClick: () => void;
    private disabled: boolean = false;

    constructor(onClick: () => void) {
        super();
        this.onClick = onClick;

        this.eventMode = "static";
        this.cursor = "pointer";

        this.sprite = new Sprite(Assets.get('spin'));
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(1010, 650);

        this.originalScaleX = this.sprite.scale.x;
        this.originalScaleY = this.sprite.scale.y;

        this.addChild(this.sprite);

        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointerup', this.onPointerUp, this);
        this.on('pointerupoutside', this.onPointerUp, this);
        this.on('pointertap', this.onTap, this);
    };

    private onPointerDown(): void {
        if (this.disabled) return;

        this.sprite.texture = Assets.get('spin_pressed');
    };

    private onPointerUp(): void {
        if (this.disabled) return;

        this.sprite.texture = Assets.get('spin');

        gsap.killTweensOf(this.sprite.scale);

        gsap.to(this.sprite.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.2,
            ease: "back.out(4)"
        })
    };

    private onTap(): void {
        if (this.disabled) return;
        this.onClick();

        gsap.killTweensOf(this.sprite.scale);

        const tl = gsap.timeline();

        tl.to(this.sprite.scale, {
            x: this.originalScaleX * 0.95,
            y: this.originalScaleY * 0.95,
            duration: 0.08,
            ease: "power2.out"
        });

        tl.to(this.sprite.scale, {
            x: this.originalScaleX,
            y: this.originalScaleY,
            duration: 0.12,
            ease: "back.out(4)"
        });
    };

    public setDisabled(value: boolean): void {
        this.disabled = value;
        this.alpha = value ? 0.5 : 1;
        this.cursor = value ? 'default' : 'pointer';
        this.sprite.texture = Assets.get('spin');
    }
}