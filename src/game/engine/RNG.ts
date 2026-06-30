export class RNG {
    private seed: number;

    constructor(seed: number = Date.now()) {
        this.seed = seed;
    }

    public next(): number {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }
}