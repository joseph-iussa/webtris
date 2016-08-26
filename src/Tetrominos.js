import deepFreeze from 'deep-freeze';
import { WELL_HEIGHT_VIS } from './constants';
import TetrominoRotation from './TetrominoRotation'

class Tetromino {
    constructor(colour, spawnPos, rotations) {
        this.colour = colour;
        this.spawnPos = spawnPos;
        this.rotations = rotations;

        return deepFreeze(this);
    }
}

export const I = new Tetromino(
    'cyan',
    { x: 3, y: WELL_HEIGHT_VIS - 2 },
    [
        new TetrominoRotation(`
            . . . .
            # # # #
            . . . .
            . . . .
        `),
        new TetrominoRotation(`
            . . # .
            . . # .
            . . # .
            . . # .
        `),
        new TetrominoRotation(`
            . . . .
            . . . .
            # # # #
            . . . .
        `),
        new TetrominoRotation(`
            . # . .
            . # . .
            . # . .
            . # . .
        `)
    ]
);

export const J = new Tetromino(
    'blue',
    { x: 3, y: WELL_HEIGHT_VIS - 1 },
    [
        new TetrominoRotation(`
            . . . .
            # . . .
            # # # .
            . . . .
        `),
        new TetrominoRotation(`
            . . . .
            . # # .
            . # . .
            . # . .
        `),
        new TetrominoRotation(`
            . . . .
            . . . .
            # # # .
            . . # .
        `),
        new TetrominoRotation(`
            . . . .
            . # . .
            . # . .
            # # . .
        `),

    ]
);

export const L = new Tetromino(
    'orange',
    { x: 3, y: WELL_HEIGHT_VIS - 1 },
    [
        new TetrominoRotation(`
            . . . .
            . . # .
            # # # .
            . . . .
        `),
        new TetrominoRotation(`
            . . . .
            . # . .
            . # . .
            . # # .
        `),
        new TetrominoRotation(`
            . . . .
            . . . .
            # # # .
            # . . .
        `),
        new TetrominoRotation(`
            . . . .
            # # . .
            . # . .
            . # . .
        `),
    ]
);

export const O = new Tetromino(
    'yellow',
    { x: 4, y: WELL_HEIGHT_VIS },
    // All O piece rotations are identical.
    new Array(4).fill(new TetrominoRotation(`
        . . . .
        . . . .
        # # . .
        # # . .
    `))
);

export const S = new Tetromino(
    'green',
    { x: 3, y: WELL_HEIGHT_VIS - 1 },
    [
        new TetrominoRotation(`
            . . . .
            . # # .
            # # . .
            . . . .
        `),
        new TetrominoRotation(`
            . . . .
            . # . .
            . # # .
            . . # .
        `),
        new TetrominoRotation(`
            . . . .
            . . . .
            . # # .
            # # . .
        `),
        new TetrominoRotation(`
            . . . .
            # . . .
            # # . .
            . # . .
        `),
    ]
);

export const T = new Tetromino(
    'purple',
    { x: 3, y: WELL_HEIGHT_VIS - 1 },
    [
        new TetrominoRotation(`
            . . . .
            . # . .
            # # # .
            . . . .
        `),
        new TetrominoRotation(`
            . . . .
            . # . .
            . # # .
            . # . .
        `),
        new TetrominoRotation(`
            . . . .
            . . . .
            # # # .
            . # . .
        `),
        new TetrominoRotation(`
            . . . .
            . # . .
            # # . .
            . # . .
        `),
    ]
);

export const Z = new Tetromino(
    'red',
    { x: 3, y: WELL_HEIGHT_VIS - 1 },
    [
        new TetrominoRotation(`
            . . . .
            # # . .
            . # # .
            . . . .
        `),
        new TetrominoRotation(`
            . . . .
            . . # .
            . # # .
            . # . .
        `),
        new TetrominoRotation(`
            . . . .
            . . . .
            # # . .
            . # # .
        `),
        new TetrominoRotation(`
            . . . .
            . # . .
            # # . .
            # . . .
        `),
    ]
);

export const EMPTY = new Tetromino();

export const ALL_TETROMINOS = [I, J, L, O, S, T, Z];