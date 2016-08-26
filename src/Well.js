import { WELL_HEIGHT_VIS, WELL_WIDTH } from './constants';
import { EMPTY } from './Tetrominos';
import Position from './Position';

export default class Well {
    constructor(rowsN, colsN) {
        this.rowsN = rowsN;
        this.colsN = colsN;
        this.grid = new Array(rowsN);
        this.pendingRowsToClear = [];

        // For yielding during iteration.
        this.visibleCell = {};

        for (let rowIdx = 0; rowIdx < this.grid.length; rowIdx++) {
            this.grid[rowIdx] = this.createRow();
        }
    }

    createRow() {
        return new Array(this.colsN).fill(EMPTY);
    }

    checkLineClears() {
        for (let rowIdx = 0; rowIdx < WELL_HEIGHT_VIS; rowIdx++) {
            const row = this.grid[rowIdx];
            if (row.every(cell => cell === EMPTY)) {
                break;
            }

            if (row.every(cell => cell !== EMPTY)) {
                this.pendingRowsToClear.push(rowIdx);
            }
        }

        return this.pendingRowsToClear.length;
    }

    clearLines() {
        // Compact rows.
        this.pendingRowsToClear.reverse().forEach(clearedRowIdx => {
            for (let rowIdx = clearedRowIdx; rowIdx < this.rowsN - 1; rowIdx++) {
                this.grid[rowIdx] = this.grid[rowIdx + 1];
            }
        });

        // Create new empty rows at top.
        for (let rowIdx = this.rowsN - this.pendingRowsToClear.length; rowIdx < this.rowsN; rowIdx++) {
            this.grid[rowIdx] = this.createRow();
        }

        this.pendingRowsToClear = [];
    }

    *visibleCells() {
        for (let rowIdx = 0; rowIdx < WELL_HEIGHT_VIS; rowIdx++) {
            for (let colIdx = 0; colIdx < WELL_WIDTH; colIdx++) {
                let cell = this.grid[rowIdx][colIdx];
                if (cell === EMPTY) {
                    continue;
                }
                this.visibleCell.x = colIdx;
                this.visibleCell.y = rowIdx;
                this.visibleCell.cell = cell;

                yield this.visibleCell;
            }
        }
    }
}