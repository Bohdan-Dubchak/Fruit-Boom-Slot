import {Assets, Container, Sprite, Graphics, Ticker} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {ReelAnimations} from "../animations/ReelAnimations.ts";
import {RNG} from "../game/engine/RNG.ts";

interface SymbolCell extends Container {
    symbolId: string;
    icon: Sprite;
    animations: ReelAnimations;
}

const DROP_DURATION = 0.32;
const DROP_FROM_OFFSET = -GAME_CONFIG.SYMBOL_SIZE * 1.2;

function squashAndStretch(t: number): { scaleX: number; scaleY: number } {
    if (t < 0.7) {
        const ratio = t / 0.7;
        return {
            scaleX: 1 - ratio * 0.15,
            scaleY: 1 + ratio * 0.35,
        };
    } else {
        const ratio = (t - 0.7) / 0.3;
        const splat = Math.sin(ratio * Math.PI);
        return {
            scaleX: 1 + splat * 0.18,
            scaleY: 1 - splat * 0.20,
        };
    }
}

function easeOutBack(t: number): number {
    const c1 = 1.4;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

interface DroppingEntry {
    cell: SymbolCell;
    fromY: number;
    toY: number;
    elapsed: number;
    done: boolean;
    resolve: () => void;
}

export class Reel extends Container {
    private symbols: SymbolCell[] = [];
    private readonly symbolSize = GAME_CONFIG.SYMBOL_SIZE;
    private symbolsContainer: Container;

    private droppingCells: DroppingEntry[] = [];
    private isDropping = false;

    constructor(_rng: RNG) {
        super();

        this.symbolsContainer = new Container();
        this.addChild(this.symbolsContainer);
    };

    public init(): void {
        this.createCells();
        this.createMask();
        Ticker.shared.add(this.update, this);
    };

    private createMask(): void {
        const mask = new Graphics();
        mask.rect(0, 0, this.symbolSize, this.symbolSize * GAME_CONFIG.ROWS);
        mask.fill(0xffffff);
        this.addChild(mask);
        this.symbolsContainer.mask = mask;
    };

    private createCells(): void {
        for (let row = 0; row < GAME_CONFIG.ROWS; row++) {
            const cell = new Container() as SymbolCell;
            cell.icon = new Sprite();
            cell.addChild(cell.icon);

            cell.animations = new ReelAnimations(cell);

            cell.symbolId = "";
            cell.y = DROP_FROM_OFFSET;
            cell.visible = false;
            this.symbols.push(cell);
            this.symbolsContainer.addChild(cell);
        }
    }

    private applyIcon(cell: SymbolCell, id: string): void {
        const texture = Assets.get(id);
        if (!texture) return;

        cell.icon.texture = texture;
        cell.symbolId = id;
        const scale = Math.min(
            this.symbolSize / texture.width,
            this.symbolSize / texture.height,
        );

        cell.icon.scale.set(scale);
        cell.icon.position.set(
            (this.symbolSize - cell.icon.width) / 2,
            (this.symbolSize - cell.icon.height) / 2
        );
    }

    private resetCellScale(cell: SymbolCell): void {
        cell.scale.set(1, 1);
        cell.x = 0;
    }

    public dropSymbol(rowIndex: number, symbolId: string): Promise<void> {
        return new Promise<void>((resolve) => {
            const cell = this.symbols[rowIndex];
            this.applyIcon(cell, symbolId);
            this.resetCellScale(cell);
            cell.visible = true;
            cell.y = DROP_FROM_OFFSET;

            const toY = rowIndex * this.symbolSize;

            this.droppingCells.push({
                cell,
                fromY: DROP_FROM_OFFSET,
                toY,
                elapsed: 0,
                done: false,
                resolve,
            });

            this.isDropping = true;
        });
    }

    public showSymbol(rowIndex: number, symbolId: string): void {
        const cell = this.symbols[rowIndex];

        this.applyIcon(cell, symbolId);
        this.resetCellScale(cell);
        cell.y = rowIndex * this.symbolSize;
        cell.visible = true;
    };

    public clearSymbols(): void {
        for (const cell of this.symbols) {
            cell.visible = false;
            cell.y = DROP_FROM_OFFSET;
            this.resetCellScale(cell);
        }
        this.droppingCells = [];
        this.isDropping = false;
    }

    public getIsDropping(): boolean {
        return this.isDropping;
    }

    public getIsSpinning(): boolean {
        return this.isDropping;
    }

    private update(ticker: Ticker): void {
        if (!this.isDropping) return;

        const ds = ticker.deltaMS / 1000;
        let anyActive = false;

        for (const entry of this.droppingCells) {
            if (entry.done) continue;
            anyActive = true;

            entry.elapsed += ds;
            const t = Math.min(entry.elapsed / DROP_DURATION, 1);

            entry.cell.y = entry.fromY + (entry.toY - entry.fromY) * easeOutBack(t);

            const { scaleX, scaleY } = squashAndStretch(t);
            entry.cell.scale.set(scaleX, scaleY);
            entry.cell.x = (this.symbolSize - this.symbolSize * scaleX) / 2;

            if (t >= 1) {
                entry.cell.y = entry.toY;
                this.resetCellScale(entry.cell);
                entry.done = true;
                entry.resolve();
            }
        }

        if (!anyActive) {
            this.droppingCells = [];
            this.isDropping = false;
        }
    }

    public destroy(): void {
        Ticker.shared.remove(this.update, this);
        super.destroy();
    }
}