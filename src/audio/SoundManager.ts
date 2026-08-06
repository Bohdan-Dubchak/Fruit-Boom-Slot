import {Howl} from 'howler';

export class SoundManager {
    private sounds: Map<string, Howl> = new Map();
    private musicVolume: number = 0.3;
    private sfxVolume: number = 0.8;
    private muted : boolean = false;
    private musicEnabled: boolean = true;

    constructor() {
        this.loadSounds();
    };

    private loadSounds(): void {
        this.sounds.set("music", new Howl({
            src: ['/audio/game.ogg'],
            loop: true,
            volume: this.musicVolume
        }));

        this.sounds.set("spin", new Howl({
            src: ['/audio/start3.ogg'],
            volume: 1
        }));

        this.sounds.set('reelStop', new Howl({
            src: ['/audio/stop1.ogg'],
            volume: this.sfxVolume * 0.5
        }));

        this.sounds.set('win', new Howl({
            src: ['/audio/win_4.ogg'],
            volume: this.sfxVolume
        }));

        this.sounds.set('bigWin', new Howl({
            src: ['/audio/bigwin1.ogg'],
            volume: 1.0
        }))

        this.sounds.set("autoSpin", new Howl({
            src: ['/audio/button_click.ogg'],
            volume: this.sfxVolume * 0.6
        }));

        this.sounds.set("bet", new Howl({
            src: ['/audio/button.ogg'],
            volume: this.sfxVolume * 0.4
        }));

        this.sounds.set("settingsBtn", new Howl({
            src: ['/audio/button_click.ogg'],
            volume: this.sfxVolume * 0.4
        }));
    };

    public play(soundName: string): void {
        if (!this.muted) {
            const sound = this.sounds.get(soundName);
            if (sound && !sound.playing()) {
                sound.play();
            }
        }
    };

    public playMusic(): void {
        const music = this.sounds.get('music');
        if (music && !music.playing() && this.musicEnabled) {
            music.play();
        }
    };

    public stop(soundName: string): void {
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.stop();
        }
    };

    public toggleSound(): void {
        this.muted = !this.muted;

        if (this.muted) {
            Howler.mute(true);
        } else {
            Howler.mute(false);
        }
    };

    public toggleMusic(): boolean {
        const music = this.sounds.get('music');
        if (!music) return false;

        if (music.playing()) {
            music.stop();
            this.musicEnabled = false;
            return false;
        } else {
            music.play();
            this.musicEnabled = true;
            return true;
        }
    };

    public isMusicPlaying(): boolean {
        return this.sounds.get('music')?.playing() ?? false;
    };

    public isSoundMuted(): boolean {
        return this.muted;
    };

    public destroy(): void {
        this.sounds.clear();
    };
}