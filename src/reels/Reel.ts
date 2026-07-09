import {Assets, Container, Sprite} from "pixi.js";
import {GAME_CONFIG} from "../config/game.ts";
import {ReelAnimations} from "../animations/ReelAnimations.ts";

interface SymbolCell extends Container {
    symbolId: string;
    icon: Sprite;
    animations: ReelAnimations;
}

export class Reel extends Container {
    private symbols: SymbolCell[] = [];
    private readonly symbolSize = GAME_CONFIG.SYMBOL_SIZE;
    private symbolsContainer: Container;

    constructor() {
        super();

        this.symbolsContainer = new Container();
        this.addChild(this.symbolsContainer);
    };

    public init(): void {
        this.createCells();
    };
    //@ts-ignore
    private createMask(): void {

    };

    private createCells(): void {
        for (let row = 0; row < GAME_CONFIG.ROWS; row++) {
            const cell = new Container() as SymbolCell;
            cell.icon = new Sprite();
            cell.addChild(cell.icon);

            cell.animations = new ReelAnimations(cell);

            cell.symbolId = "";
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

    public showSymbol(rowIndex: number, symbolId: string): void {
        const cell = this.symbols[rowIndex];

        this.applyIcon(cell, symbolId);
        // this.resetCellScale(cell);
        cell.y = rowIndex * this.symbolSize;
        cell.visible = true;
    };
}