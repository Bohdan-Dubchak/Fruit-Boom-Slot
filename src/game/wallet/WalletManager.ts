export class WalletManager {
    private balance: number;
    private bet: number;
    private readonly MIN_BET: number;

    constructor(initialBalance = 100,  initialBet = 5, minBet = 1) {
        this.balance = initialBalance;
        this.bet = initialBet;
        this.MIN_BET = minBet;
    }
    getBalance(): number {
        return this.balance;
    };

    getBet(): number {
        return this.bet;
    };

    getMinBet(): number {
        return this.MIN_BET;
    };

    increaseBet(step = 1): void {
        this.bet += step;
        this.clampBet();
    };

    decreaseBet(step = 1): void {
        this.bet -= step;
        this.clampBet();
    }

    private clampBet(): void {
        const maxBet = this.balance;

        this.bet = Math.max(this.MIN_BET, Math.min(this.bet, maxBet));
    };

    canSpin(): boolean {
        return this.balance >= this.bet && this.bet >= Math.min(this.MIN_BET);
    };

    spendBet(): boolean {
        if (!this.canSpin()) return false;

        this.balance -= this.bet;
        return true;
    };

    addWin(amount: number): void {
        if (amount <= 0) return;

        this.balance += amount;
        this.clampBet();
    };
}