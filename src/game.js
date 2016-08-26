import {
    WELL_CANVAS_HEIGHT, WELL_CANVAS_WIDTH, CELL_SIZE, NEXT_PIECE_CANVAS_SIZE,
    WELL_HEIGHT, WELL_WIDTH, BASE_PIECE_GRAVITY_FREQUENCY, PIECE_MOVE_INTERVAL,
    PIECE_LOCK_DELAY, PIECE_LOCK_ANIM_DURATION
} from './constants';
import { ALL_TETROMINOS } from './Tetrominos';
import Well from './well';
import RandomBag from './RandomBag';
import Timer from './Timer';
import RepeatingTimer from './RepeatingTimer';
import Piece from './Piece';
import { update } from './update';
import { render, updateScoreDisplay } from './drawing';

const wellEl = document.getElementById('well');
const nextPieceEl = document.getElementById('nextPiece');
const wellCanvas = document.querySelector('#well canvas');
const nextPieceCanvas = document.querySelector('#nextPiece canvas');

// These heights are several pixels off if I don't do this.
wellEl.style.height = `${WELL_CANVAS_HEIGHT}px`;

wellCanvas.width = WELL_CANVAS_WIDTH;
wellCanvas.height = WELL_CANVAS_HEIGHT;

nextPieceCanvas.width = NEXT_PIECE_CANVAS_SIZE;
nextPieceCanvas.height = NEXT_PIECE_CANVAS_SIZE;

const wellCtx = wellCanvas.getContext('2d');
const nextPieceCtx = nextPieceCanvas.getContext('2d');

const state = {
    started: false,
    paused: false,
    well: new Well(WELL_HEIGHT, WELL_WIDTH),
    pieceQueue: new RandomBag(ALL_TETROMINOS),
    piece: new Piece(),
    pieceShadow: new Piece(),
    collisionCheckPiece: new Piece(),
    gravityFrequency: BASE_PIECE_GRAVITY_FREQUENCY,
    timers: {
        pieceGravity: new RepeatingTimer(BASE_PIECE_GRAVITY_FREQUENCY),
        pieceLeft: new RepeatingTimer(PIECE_MOVE_INTERVAL),
        pieceRight: new RepeatingTimer(PIECE_MOVE_INTERVAL),
        pieceLock: new Timer(PIECE_LOCK_DELAY),
        lineClearAnim: new Timer(PIECE_LOCK_ANIM_DURATION)
    },
    input: {},
    inPieceLockDelay: false,
    inLineClearAnim: false,
    pendingLineClears: false,
    currentClearedLineCount: 0,
    level: 1,
    score: {
        points: 0,
        cleared1: 0,
        cleared2: 0,
        cleared3: 0,
        cleared4: 0,
        clearedTotal: 0,
        highScore: 0,
        highestLevel: 1,
    },
};

const scoreDisplayEls = {
    points: document.querySelector('#points *:last-child'),
    level: document.querySelector('#level *:last-child'),
    cleared1: document.querySelector('#cleared1 *:last-child'),
    cleared2: document.querySelector('#cleared2 *:last-child'),
    cleared3: document.querySelector('#cleared3 *:last-child'),
    cleared4: document.querySelector('#cleared4 *:last-child'),
    clearedTotal: document.querySelector('#clearedTotal *:last-child'),
    highScore: document.querySelector('#highScore *:last-child'),
    highestLevel: document.querySelector('#highestLevel *:last-child'),
}

// Persistence.
if (localStorage.length) {
    state.score.highScore = parseInt(localStorage.highScore) || 0;
    state.score.highestLevel = parseInt(localStorage.highestLevel) || 1;
    updateScoreDisplay(state.level, state.score, scoreDisplayEls);
}

addEventListener('keydown', e => {
    if (state.paused) return;
    if (e.repeat) return;

    switch (e.code) {
        case 'KeyW':
            state.input.pieceDropKeyDown = true;
            break;
        case 'KeyA':
            state.input.pieceLeftKeyDown = true;
            break;
        case 'KeyS':
            state.input.pieceDownKeyDown = true;
            break;
        case 'KeyD':
            state.input.pieceRightKeyDown = true;
            break;
        case 'ArrowLeft':
            state.input.pieceRotACWKeyDown = true;
            break;
        case 'ArrowRight':
            state.input.pieceRotCWKeyDown = true;
            break;
        default:
            break;
    }
});

addEventListener('keyup', e => {
    if (state.paused) return;

    switch (e.code) {
        case 'KeyA':
            state.input.pieceLeftKeyUp = true;
            break;
        case 'KeyS':
            state.input.pieceDownKeyUp = true;
            break;
        case 'KeyD':
            state.input.pieceRightKeyUp = true;
            break;
        default:
            break;
    }
});

addEventListener('keydown', e => {
    if (e.code === 'KeyP' && state.started) {
        state.paused = !state.paused;
    }
});

// Need to do this here, after score display has been filled in, to get correct width.
nextPieceEl.style.height = getComputedStyle(nextPieceEl).getPropertyValue('width');

// render start game prompt
const startButton = document.createElement('button');
startButton.appendChild(document.createTextNode('Start'));
startButton.id = 'startButton';
startButton.autofocus = true;
startButton.onclick = () => {
    initGame();
}
wellEl.appendChild(startButton);
// Center button horizontally and vertically.
startButton.style.left = `${(parseInt(getComputedStyle(wellEl).getPropertyValue('width').replace('px', '')) / 2)
    - (parseInt(getComputedStyle(startButton).getPropertyValue('width').replace('px', '')) / 2)}px`;
startButton.style.top = `${(parseInt(getComputedStyle(wellEl).getPropertyValue('height').replace('px', '')) / 2)
    - (parseInt(getComputedStyle(startButton).getPropertyValue('height').replace('px', '')) / 2)}px`;

let lastTs;
function run(currentTs) {
    let dt = currentTs - lastTs;
    if (!state.paused) {
        update(dt, state);
    }
    render(wellCtx, nextPieceCtx, scoreDisplayEls, state);
    lastTs = currentTs;

    window.requestAnimationFrame(run);
}

function initGame() {
    state.started = true;
    wellEl.removeChild(startButton);
    state.piece.init(state.pieceQueue.pop());
    lastTs = window.performance.now();
    window.requestAnimationFrame(run);
}