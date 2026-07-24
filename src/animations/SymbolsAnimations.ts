import { type Sprite } from "pixi.js";
import gsap from "gsap";

const PULSE_IN_DURATION = 0.4;
const PULSE_OUT_DURATION = 0.22;
const PULSE_SCALE_DELTA = 0.10;

const ROTATION_IN_DURATION = 0.18;
const ROTATION_OUT_DURATION = 0.22;
const ROTATION_DELTA = 0.03;

export function symbolsAnimations(icons: Sprite[]): void {
    icons.forEach((icon) => {
        gsap.killTweensOf(icon);
        gsap.killTweensOf(icon.scale);

        const originalRotation = icon.rotation;
        const originalScaleX = icon.scale.x;
        const originalScaleY = icon.scale.y;

        const tl = gsap.timeline({ repeat: -1 });

        tl.to(icon, {
            rotation: originalRotation - ROTATION_DELTA,
            duration: ROTATION_IN_DURATION,
            ease: "sine.inOut"
        }, 0)
            .to(icon, {
                rotation: originalRotation,
                duration: ROTATION_OUT_DURATION,
                ease: "sine.inOut"
            }, ROTATION_IN_DURATION);

        tl.to(icon.scale, {
            x: originalScaleX - PULSE_SCALE_DELTA,
            y: originalScaleY - PULSE_SCALE_DELTA,
            duration: PULSE_IN_DURATION,
            ease: "sine.inOut"
        }, 0)
            .to(icon.scale, {
                x: originalScaleX,
                y: originalScaleY,
                duration: PULSE_OUT_DURATION,
                ease: "sine.inOut"
            }, PULSE_IN_DURATION);
    });
}