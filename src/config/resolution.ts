export class ResolutionManager {
    private static readonly MAX_RESOLUTIONS: number = 2;
    private static readonly MIN_RESOLUTIONS: number = 1;

    static  isHighDPI(): boolean {
        return (window.devicePixelRatio || 1) > 1;
    };

    static getAdaptiveResolution(): number {
        const dpr = window.devicePixelRatio || 1;
        const pixels = window.innerWidth * window.innerHeight;

        if (pixels < 500000) {
            return Math.min(dpr, this.MAX_RESOLUTIONS);
        } else if (pixels < 2000000) {
            return Math.min(dpr, 1.5);
        } else {
            return this.MIN_RESOLUTIONS;
        }
    };
}