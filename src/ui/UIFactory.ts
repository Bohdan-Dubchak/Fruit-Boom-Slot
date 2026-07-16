import {Container} from "pixi.js";
import {SpinButton} from "./spinBtn/spinBtn.ts";
import {PlusBet} from "./button/plusButton.ts";
import {MinusBet} from "./button/minusButton.ts";

export class UIFactory {

    createGameUI(onSpin: () => void): { elements: Container[], spinButton: SpinButton } {
        const spinButton = new SpinButton(onSpin);

        const plusButton = new PlusBet();
        const minusButton = new MinusBet();

        return {
            elements: [spinButton, plusButton, minusButton],
            spinButton
        }
    };
}