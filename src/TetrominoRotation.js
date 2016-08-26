export default class TetrominoRotation {
    constructor(rotationDescriptionString) {
        this.cells = [];
        rotationDescriptionString.trim().split('\n')
            .reverse()
            .forEach((row, rowIdx) => {
                row.trim().split(/\s+/).forEach((col, colIdx) => {
                    if (col === '#') {
                        this.cells.push({ x: colIdx, y: rowIdx });
                    }
                });
            });
    }

    *[Symbol.iterator]() {
        for (const cell of this.cells) {
            yield cell;
        }
    }
}