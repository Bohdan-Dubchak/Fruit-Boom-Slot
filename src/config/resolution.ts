export class ResolutionManager {
    private static readonly MAX_RESOLUTIONS: number = 2;
    private static readonly MIN_RESOLUTIONS: number = 1;

    static getOptimalResolution(): number {
        const dpr = window.devicePixelRatio || 1;
        return Math.max(this.MIN_RESOLUTIONS, Math.min(dpr, this.MAX_RESOLUTIONS));
    }

    static getResolutionByQuality(quality: 'low' | 'medium' | 'high'): number {
        const dpr = window.devicePixelRatio || 1;

        switch (quality) {
            case 'low': return this.MIN_RESOLUTIONS;
            case 'medium': return Math.min(dpr, 1.5);
            case 'high': return Math.min(dpr, this.MAX_RESOLUTIONS);
            default: return this.getOptimalResolution();
        }
    }

    static  isHighDPI(): boolean {
        return (window.devicePixelRatio || 1) > 1;
    }

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
    }
}