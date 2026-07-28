import {Container} from "pixi.js";
import gsap from "gsap";

export function animatePressed(target: Container): void {
    gsap.killTweensOf(target.scale);

    const tl = gsap.timeline();

    tl.to(target.scale, {
        x: target.scale.x * 0.95,
        y: target.scale.y * 0.95,
        duration: 0.08,
        ease: 'power2.out',
    });

    tl.to(target.scale, {
        x: target.scale.x,
        y: target.scale.y,
        duration: 0.12,
        ease: 'back.out(4)',
    });
}