import {ReelsContainer} from "../../reels/ReelsContainer.ts";
import {WeightedSpinGenerator} from "../../engine/WeightedSpinGenerator.ts";

export class SpinManager {
    private reelsContainer: ReelsContainer;
    private spinGenerator: WeightedSpinGenerator;
    private onSpinStart?: () => void;
    private onSpinEnd?: () => void;

    constructor(reelsContainer: ReelsContainer, spinGenerator: WeightedSpinGenerator) {
        this.reelsContainer = reelsContainer;
        this.spinGenerator = spinGenerator;
    };

    public executeSpin(): void {
        if (this.reelsContainer.getIsAnySpinning()) return;

        const matrix = this.spinGenerator.generateMatrix();

        this.reelsContainer.spinAll(matrix, () => {
            this.onSpinEnd?.();
        });

        this.onSpinStart?.();
    }

    public setSpinCallbacks(onStart: () => void, onEnd: () => void): void {
        this.onSpinStart = onStart;
        this.onSpinEnd = onEnd;
    }
}