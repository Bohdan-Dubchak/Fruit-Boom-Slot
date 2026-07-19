import {Container} from "pixi.js";
import {SpinButton} from "./spinBtn/spinBtn.ts";
import {AutoSpinBtn} from "./spinBtn/autoSpinBtn.ts";
import {PlusBet} from "./button/plusButton.ts";
import {MinusBet} from "./button/minusButton.ts";
import {BetManager} from "../game/bet/BetManager.ts";

export class UIFactory {

    createGameUI(onSpin: () => void,
                 onAutoSpin: () => void,
                 betManager: BetManager): { elements: Container[], spinButton: SpinButton, autoSpin: AutoSpinBtn } {
        const spinButton = new SpinButton(onSpin);
        const autoSpin = new AutoSpinBtn(onAutoSpin);

        const plusButton = new PlusBet();
        this.setupBetButton(plusButton,
            () => betManager.startIncreasing(),
            () => betManager.stop()
        );

        const minusButton = new MinusBet();
        this.setupBetButton(minusButton,
            () => betManager.startDecreasing(),
            () => betManager.stop()
        );

        return {
            elements: [spinButton, autoSpin, plusButton, minusButton],
            spinButton,
            autoSpin
        }
    };

    private setupBetButton(button: any, onHold: () => void, onRelease: () => void): void {
        button.on("pointerdown", onHold);
        button.on("pointerup", onRelease);
        button.on("pointerupoutside", onRelease);
    }
}