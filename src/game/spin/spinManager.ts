import {ReelsContainer} from "../../reels/ReelsContainer.ts";
import {WeightedSpinGenerator} from "../../engine/WeightedSpinGenerator.ts";
import {WalletManager} from "../wallet/WalletManager.ts";
import {BetManager} from "../bet/BetManager.ts";

export class SpinManager {
    private isAutoSpinActive: boolean = false;
    private reelsContainer: ReelsContainer;
    private spinGenerator: WeightedSpinGenerator;
    private wallet: WalletManager;
    private betManager: BetManager;

    private onSpinStart?: () => void;
    private onSpinEnd?: () => void;
    private onWinCheck: (matrix: string[][]) => void;
    private onBalanceUpdate: () => void;

    constructor(
                reelsContainer: ReelsContainer,
                spinGenerator: WeightedSpinGenerator,
                wallet: WalletManager,
                betManager: BetManager,
                onWinCheck: (matrix: string[][]) => void,
                onBalanceUpdate: () => void) {
        this.reelsContainer = reelsContainer;
        this.spinGenerator = spinGenerator;
        this.wallet = wallet;
        this.betManager = betManager;
        this.onWinCheck = onWinCheck;
        this.onBalanceUpdate = onBalanceUpdate;
    };

    public executeSpin(): void {
        if (this.reelsContainer.getIsAnySpinning()) return;
        if (!this.wallet.canSpin()) {
            this.stopAutoSpin();
            return;
        }

        this.betManager.setSpinning(true);
        this.wallet.spendBet();
        this.onBalanceUpdate();
        this.onSpinStart?.();

        const matrix = this.spinGenerator.generateMatrix();

        this.reelsContainer.spinAll(matrix, () => {
            this.onWinCheck(matrix);
            this.onBalanceUpdate();
            this.betManager.setSpinning(false);
            this.onSpinEnd?.();

            if (this.isAutoSpinActive) {
                setTimeout(() => this.executeSpin(), 800);
            }
        });

    }

    public toggleAutoSpin(): void {
        this.isAutoSpinActive = !this.isAutoSpinActive;
        if (this.isAutoSpinActive) {
            this.executeSpin();
        }
    }

    public stopAutoSpin(): void {
        this.isAutoSpinActive = false;
    }

    public setSpinCallbacks(onStart: () => void, onEnd: () => void): void {
        this.onSpinStart = onStart;
        this.onSpinEnd = onEnd;
    };
}