import {Container} from "pixi.js";
import {SpinButton} from "./spinBtn/spinBtn.ts";
import {AutoSpinBtn} from "./spinBtn/autoSpinBtn.ts";
import {PlusBet} from "./button/plusButton.ts";
import {MinusBet} from "./button/minusButton.ts";
import {BetManager} from "../game/bet/BetManager.ts";
import {HomeButton} from "./button/homeButton.ts";
import {SettingsButton} from "./button/settingsButton.ts";
import {SoundManager} from "../audio/SoundManager.ts";

export class UIFactory {
    private soundManager: SoundManager;

    constructor(soundManager: SoundManager) {
        this.soundManager = soundManager;
    }

    createGameUI(onSpin: () => void,
                 onAutoSpin: () => void,
                 betManager: BetManager,
                 settings: () => void): { elements: Container[], spinButton: SpinButton, autoSpin: AutoSpinBtn } {
        const spinButton = new SpinButton(onSpin, this.soundManager);
        const autoSpin = new AutoSpinBtn(onAutoSpin, this.soundManager);

        const homeBtn = new HomeButton('https://github.com/Bohdan-Dubchak/Fruit-Boom-Slot', this.soundManager);
        const infoBtn = new SettingsButton(settings, this.soundManager);

        const plusButton = new PlusBet(this.soundManager);
        this.setupBetButton(plusButton,
            () => betManager.startIncreasing(),
            () => betManager.stop()
        );

        const minusButton = new MinusBet(this.soundManager);
        this.setupBetButton(minusButton,
            () => betManager.startDecreasing(),
            () => betManager.stop()
        );

        return {
            elements: [spinButton, autoSpin, plusButton, minusButton, homeBtn, infoBtn],
            spinButton,
            autoSpin
        }
    };

    private setupBetButton(button: any, onHold: () => void, onRelease: () => void): void {
        button.on("pointerdown", onHold);
        button.on("pointerup", onRelease);
        button.on("pointerupoutside", onRelease);
    };
}