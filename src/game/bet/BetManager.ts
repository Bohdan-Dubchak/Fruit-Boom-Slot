import {WalletManager} from "../wallet/WalletManager.ts";

export class BetManager {
    private interval: ReturnType<typeof setInterval> | null = null;
    private readonly INTERVAL_DELAY: number = 190;
    private isSpinning: boolean = false;
    private wallet: WalletManager;
    private onBetChange: (bet: number) => void;

    constructor(wallet: WalletManager, onBetChange: (bet: number) => void) {
        this.wallet = wallet;
        this.onBetChange = onBetChange;
    };

    setSpinning(spinning: boolean): void {
        this.isSpinning = spinning;
        if (spinning) {
            this.stop();
        }
    };

    startIncreasing(): void {
        if (this.isSpinning) return;

        this.stop();

        this.wallet.increaseBet();
        this.onBetChange(this.wallet.getBet());

        this.interval = setInterval(() => {
            this.wallet.increaseBet();
            this.onBetChange(this.wallet.getBet());
        }, this.INTERVAL_DELAY);
    };

    startDecreasing(): void {
        if (this.isSpinning) return;

        this.stop();

        this.wallet.decreaseBet();
        this.onBetChange(this.wallet.getBet());

        this.interval = setInterval(() => {
            this.wallet.decreaseBet();
            this.onBetChange(this.wallet.getBet());
        }, this.INTERVAL_DELAY);
    };

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    };

    destroy(): void {
        this.stop();
    };
}