import {Container} from "pixi.js";
import {SpinButton} from "./spinBtn/spinBtn.ts";

export class UIFactory {

    createGameUI(onSpin: () => void): { elements: Container[], spinButton: SpinButton } {
        const spinButton = new SpinButton(onSpin);

        return {
            elements: [spinButton],
            spinButton
        }
    };
}