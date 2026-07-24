import {Container, AnimatedSprite, Assets, Texture, type Sprite} from "pixi.js";
import gsap from "gsap";
import type {SymbolCell} from "../../reels/Reel.ts";
import {GAME_CONFIG} from "../../config/game.ts";
import type {WinLine} from "../calculator/WinManager.ts";
import {symbolsAnimations} from "../../animations/SymbolsAnimations.ts";

const ANIMATED_SYMBOLS: Record<string, number> = {
    'symbol_0':  28,
    'symbol_1':  28,
    'symbol_7':  24,
    'symbol_18': 24,
};

const BACK_ANIM = {
    atlas: 'animations1',
    prefix: 'back_anim_big_',
    frameCount: 30,
    originalSize: 148,
    speed: 0.15,
    enabled: false,
};

const FRAME_ANIM = {
    atlas: 'frames',
    prefix: 'frame_',
    frameCount: 21,
    originalSize: 154,
    speed: 0.30,
};

const FRONT_ANIM = {
    atlas: 'animations2',
    prefix: 'front_anim_',
    frameCount: 50,
    originalSize: 175,
    speed: 0.13,
};

const SYMBOL_ANIM_ORIGINAL_SIZE = 128;
const SYMBOL_ANIM_SPEED = 0.1;

export type GetReelSymbolVisibility = (reel: number, row: number) => SymbolCell | undefined;

export class WinHighlight {
    private container: Container;
    private activeSprites: AnimatedSprite[] = [];

    private hiddenSymbols: SymbolCell[] = [];
    private wobblingIcons: Sprite[] = [];

    private readonly getReelSymbol?: GetReelSymbolVisibility;

    private static frameFramesCache: Texture[] | null = null;
    private static frontFramesCache: Texture[] | null = null;
    private static backFramesCache: Texture[] | null = null;

    constructor(
        reelsContainer: Container,
        getReelSymbol?: GetReelSymbolVisibility,
    ) {
        this.container = new Container();
        this.container.eventMode = 'none';
        this.getReelSymbol = getReelSymbol;
        reelsContainer.addChild(this.container);
    };

    public showWins(wins: WinLine[]): void {
        this.clear();

        for (const win of wins) {
            for (const pos of win.positions) {
                this.highlightCell(pos.reel, pos.row, win.symbol);
            }
        }
    };

    public clear(): void {
        for (const sprite of this.activeSprites) {
            sprite.stop();
            sprite.destroy();
        }
        this.activeSprites = [];

        for (const symbol of this.hiddenSymbols) {
            symbol.visible = true;
        }
        this.hiddenSymbols = [];

        for (const icon of this.wobblingIcons) {
            gsap.killTweensOf(icon);
            gsap.killTweensOf(icon.scale);
            icon.rotation = 0;
        }
        this.wobblingIcons = [];
    };

    private highlightCell(reel: number, row: number, symbol: string): void {
        const x = reel * (GAME_CONFIG.SYMBOL_SIZE + GAME_CONFIG.SYMBOL_GAP_X);
        const y = row * GAME_CONFIG.SYMBOL_SIZE;
        const cx = x + GAME_CONFIG.SYMBOL_SIZE / 2;
        const cy = y + GAME_CONFIG.SYMBOL_SIZE / 2;

        const hasOwnAnimation = Boolean(ANIMATED_SYMBOLS[symbol]);

        if (hasOwnAnimation) {
            this.hideReelSymbol(reel, row);
            this.addAnim(
                this.getSymbolFrames(symbol),
                cx, cy,
                GAME_CONFIG.SYMBOL_SIZE / SYMBOL_ANIM_ORIGINAL_SIZE,
                SYMBOL_ANIM_SPEED,
            );
            return;
        }

        this.wobbleReelSymbol(reel, row);

        if (BACK_ANIM.enabled) {
            this.addAnim(
                this.getCachedFrames('back'),
                cx, cy,
                GAME_CONFIG.SYMBOL_SIZE / BACK_ANIM.originalSize,
                BACK_ANIM.speed,
            );
        }

        this.addAnim(
            this.getCachedFrames('front'),
            cx, cy,
            GAME_CONFIG.SYMBOL_SIZE / 161,
            FRONT_ANIM.speed,
        );

        this.addAnim(
            this.getCachedFrames('frame'),
            cx, cy,
            GAME_CONFIG.SYMBOL_SIZE / FRAME_ANIM.originalSize,
            FRAME_ANIM.speed,
        );
    };

    private hideReelSymbol(reel: number, row: number): void {
        if (!this.getReelSymbol) return;

        const symbolCell = this.getReelSymbol(reel, row);
        if (!symbolCell) return;

        symbolCell.visible = false;
        this.hiddenSymbols.push(symbolCell);
    };

    private wobbleReelSymbol(reel: number, row: number): void {
        if (!this.getReelSymbol) return;

        const symbolCell = this.getReelSymbol(reel, row);
        if (!symbolCell) return;

        this.wobblingIcons.push(symbolCell.icon);
        symbolsAnimations([symbolCell.icon]);
    };

    private addAnim(
        frames: Texture[],
        cx: number,
        cy: number,
        scale: number,
        speed: number,
    ): void {
        if (frames.length === 0) {
            console.warn('[WinHighlight] Немає кадрів для анімації — пропускаю шар');
            return;
        }

        const anim = new AnimatedSprite(frames);
        anim.animationSpeed = speed;
        anim.loop = true;
        anim.anchor.set(0.5);
        anim.position.set(cx, cy);
        anim.scale.set(scale);
        anim.play();

        this.container.addChild(anim);
        this.activeSprites.push(anim);
    };

    private getCachedFrames(kind: 'back' | 'frame' | 'front'): Texture[] {
        switch (kind) {
            case 'back':
                if (!WinHighlight.backFramesCache) {
                    WinHighlight.backFramesCache = this.loadFrames(BACK_ANIM.atlas, BACK_ANIM.prefix, BACK_ANIM.frameCount);
                }
                return WinHighlight.backFramesCache;
            case 'frame':
                if (!WinHighlight.frameFramesCache) {
                    WinHighlight.frameFramesCache = this.loadFrames(FRAME_ANIM.atlas, FRAME_ANIM.prefix, FRAME_ANIM.frameCount);
                }
                return WinHighlight.frameFramesCache;
            case 'front':
                if (!WinHighlight.frontFramesCache) {
                    WinHighlight.frontFramesCache = this.loadFrames(FRONT_ANIM.atlas, FRONT_ANIM.prefix, FRONT_ANIM.frameCount);
                }
                return WinHighlight.frontFramesCache;
        }
    };

    private loadFrames(atlasAlias: string, prefix: string, count: number): Texture[] {
        const atlas = Assets.get(atlasAlias);
        if (!atlas?.textures) {
            console.warn(`[WinHighlight] Атлас "${atlasAlias}" не завантажений`);
            return [];
        }

        const frames: Texture[] = [];
        for (let i = 0; i < count; i++) {
            const texture = atlas.textures[`${prefix}${i}`];
            if (texture) frames.push(texture);
        }

        if (frames.length === 0) {
            console.warn(`[WinHighlight] У атласі "${atlasAlias}" не знайдено кадрів з префіксом "${prefix}"`);
        }

        return frames;
    };

    private getSymbolFrames(symbol: string): Texture[] {
        const totalCount = ANIMATED_SYMBOLS[symbol];
        if (!totalCount) return [];

        const atlas = Assets.get('animations3-0');
        if (!atlas?.textures) {
            console.warn('[WinHighlight] Атлас "animations3-0" не завантажений');
            return [];
        }

        const result: Texture[] = [];
        for (let i = 0; i < totalCount; i++) {
            const texture = atlas.textures[`${symbol}_${i}`];
            if (texture) result.push(texture);
        }
        return result;
    };
}