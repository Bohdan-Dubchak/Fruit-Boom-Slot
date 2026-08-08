export class ScreenManager {

    public static async toggleFullscreen(): Promise<void> {
        const canvas = document.querySelector('canvas');

        if (!canvas) return;

        if (!document.fullscreenElement) {
            await canvas.requestFullscreen();

        } else {
            await document.exitFullscreen();
        }

        window.dispatchEvent(new Event('resize'));
    };
}