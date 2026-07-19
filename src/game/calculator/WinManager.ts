import {payTable} from "../../constants/payLines.ts";

export interface WinLine {
    type: 'horizontal' | 'vertical';
    symbol: string;
    row?: number;
    reel?: number;
    startReel?: number;
    length: number;
    positions: { reel: number; row: number }[];
    multiplier: number;
}

export interface WinResult {
    wins: WinLine[];
    totalMultiplier: number;
}

export class WinManager {
    public checkWins(matrix: string[][]): WinResult {
        const wins: WinLine[] = [
            ...this.checkHorizontalWins(matrix),
            ...this.checkVerticalWins(matrix),
        ];

        const totalMultiplier = wins.reduce((sum, win) => sum + win.multiplier, 0);

        return {wins, totalMultiplier};
    };

    private checkHorizontalWins(matrix: string[][]): WinLine[] {
        const wins: WinLine[] = [];
        const reelsCount = matrix.length;
        const rowsCount = matrix[0]?.length ?? 0;

        for (let row = 0; row < rowsCount; row++) {
            let col = 0;

            while (col < reelsCount) {
                const symbol = matrix[col][row];
                let  length = 1;

                while (col + length < reelsCount && matrix[col + length][row] === symbol) {
                    length++;
                }

                const multiplier = this.getMultiplier(symbol, length);
                if (multiplier > 0) {
                    const positions = [];

                    for (let i = 0; i < length; i++) {
                        positions.push({ reel: col + i, row });
                    }

                    wins.push({
                        type: 'horizontal',
                        symbol,
                        row,
                        startReel: col,
                        length,
                        positions,
                        multiplier,
                    });
                }

                col += length;
            }
        }
        return wins;
    };

    private checkVerticalWins(matrix: string[][]): WinLine[] {
        const wins: WinLine[] = [];

        for (let reel = 0; reel < matrix.length; reel++) {
            const column = matrix[reel];
            if (!column?.length) continue;

            const symbol = column[0];
            const isFullMatch = column.every(s => s === symbol);
            if (!isFullMatch) continue;

            const multiplier = this.getMultiplier(symbol, column.length);
            if (multiplier > 0) {
                const positions = column.map((_, row) => ({ reel, row }));

                wins.push({
                    type: 'vertical',
                    symbol,
                    reel,
                    length: column.length,
                    positions,
                    multiplier,
                });
            }
        }

        return wins;
    };

    private getMultiplier(symbol: string, length: number): number {
        return payTable[symbol]?.[length] ?? 0;
    }
}