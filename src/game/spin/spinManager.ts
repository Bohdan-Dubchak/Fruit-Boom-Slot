import {ReelsContainer} from "../../reels/ReelsContainer.ts";
import {WeightedSpinGenerator} from "../../engine/WeightedSpinGenerator.ts";
import {WalletManager} from "../wallet/WalletManager.ts";
import {BetManager} from "../bet/BetManager.ts";

export class SpinManager {
    private reelsContainer: ReelsContainer;
    private spinGenerator: WeightedSpinGenerator;
    private wallet: WalletManager;
    private betManager: BetManager;

    private onSpinStart?: () => void;
    private onSpinEnd?: () => void;
    private onBalanceUpdate: () => void;

    constructor(
                reelsContainer: ReelsContainer,
                spinGenerator: WeightedSpinGenerator,
                wallet: WalletManager,
                betManager: BetManager,
                onBalanceUpdate: () => void) {
        this.reelsContainer = reelsContainer;
        this.spinGenerator = spinGenerator;
        this.wallet = wallet;
        this.betManager = betManager;
        this.onBalanceUpdate = onBalanceUpdate;
    };

    public executeSpin(): void {
        if (this.reelsContainer.getIsAnySpinning()) return;
        if (!this.wallet.canSpin()) return;

        this.betManager.setSpinning(true);
        this.wallet.spendBet();
        this.onSpinStart?.();

        const matrix = this.spinGenerator.generateMatrix();

        this.reelsContainer.spinAll(matrix, () => {
            this.onBalanceUpdate();
            this.betManager.setSpinning(false);
            this.onSpinEnd?.();
        });

    }

    public setSpinCallbacks(onStart: () => void, onEnd: () => void): void {
        this.onSpinStart = onStart;
        this.onSpinEnd = onEnd;
    }
}