export const WELL_WIDTH = 10;
export const WELL_HEIGHT = 22;
export const WELL_HEIGHT_VIS = 20;

export const CELL_SIZE = calcCellSize();

export const WELL_CANVAS_HEIGHT = CELL_SIZE * WELL_HEIGHT_VIS;
export const WELL_CANVAS_WIDTH = CELL_SIZE * WELL_WIDTH;

export const NEXT_PIECE_CANVAS_SIZE = CELL_SIZE * 4;

export const BG_COLOUR = 'rgb(20%, 20%, 20%)';
export const PIECE_SHADOW_ALPHA = 0.3;

export const LEVELS = 15;

export const MAX_PIECE_GRAVITY_FREQUENCY = 700 / WELL_HEIGHT_VIS;
export const BASE_PIECE_GRAVITY_FREQUENCY = 800;
export const PIECE_GRAVITY_FREQUENCY_DECREASE_PER_LEVEL = (
    (BASE_PIECE_GRAVITY_FREQUENCY - MAX_PIECE_GRAVITY_FREQUENCY) / LEVELS
);
export const PIECE_MOVE_INTERVAL = 1000 / WELL_WIDTH * 1.7;
export const PIECE_LOCK_DELAY = 450;
export const PIECE_LOCK_ANIM_DURATION = 300;

export const POINTS = {
    CLEAR_1: 100,
    CLEAR_2: 300,
    CLEAR_3: 500,
    CLEAR_4: 800
};

function calcCellSize() {
    const bodyEl = document.querySelector('body');
    const bodyElStyle = window.getComputedStyle(bodyEl);
    const paddingTop = parseInt(bodyElStyle.getPropertyValue('padding-top').replace('px', ''), 10);
    const paddingBottom = parseInt(bodyElStyle.getPropertyValue('padding-bottom').replace('px', ''), 10);

    return Math.floor((window.innerHeight - paddingTop - paddingBottom) / WELL_HEIGHT_VIS);
}