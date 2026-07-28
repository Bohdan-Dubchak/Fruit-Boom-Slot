export class SettingsManager {
    private static _music: boolean = true;
    private static _sound: boolean = true;
    private static _fullscreen: boolean = false;

    public static get music(): boolean {
        return this._music;
    };

    public static set music(value: boolean) {
        this._music = value;
    };

    public static get sound(): boolean {
        return this._sound;
    };

    public static set sound(value: boolean) {
        this._sound = value;
    };

    public static get fullscreen(): boolean {
        return this._fullscreen;
    };

    public static set fullscreen(value: boolean) {
        this._fullscreen = value;
    };
}