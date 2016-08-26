import {
    CELL_SIZE, BG_COLOUR, PIECE_SHADOW_ALPHA,
    WELL_CANVAS_HEIGHT, WELL_CANVAS_WIDTH, NEXT_PIECE_CANVAS_SIZE
} from './constants';

export function render(wellCtx, nextPieceCtx, scoreDisplayEls, state) {
    clear(wellCtx);
    clear(nextPieceCtx);

    const { well, pieceQueue, piece } = state;

    // Render well.
    for (const { x, y, cell } of well.visibleCells()) {
        wellCtx.fillStyle = cell.colour;
        wellCtx.fillRect(
            CELL_SIZE * x,
            flipWellY(CELL_SIZE * y),
            CELL_SIZE, CELL_SIZE
        );
    }

    // Render piece.
    wellCtx.fillStyle = piece.type.colour;
    const rotation = piece.currentRotationInWellSpace;
    for (const { x, y } of rotation) {
        wellCtx.fillRect(
            CELL_SIZE * x,
            flipWellY(CELL_SIZE * y),
            CELL_SIZE, CELL_SIZE
        );
    }

    // Render line clear animation if necessary.
    if (state.inLineClearAnim) {
        wellCtx.fillStyle = `rgba(255, 255, 255, ${state.timers.lineClearAnim.completionRatio})`;
        for (const rowIdx of well.pendingRowsToClear) {
            wellCtx.fillRect(
                0, flipWellY(rowIdx * CELL_SIZE),
                WELL_CANVAS_WIDTH, CELL_SIZE
            );
        }
    }

    // If paused, render semi-opaque overlay over well.
    if (state.paused) {
        wellCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        wellCtx.fillRect(0, 0, WELL_CANVAS_WIDTH, WELL_CANVAS_HEIGHT);
    }

    // Render next piece preview.
    const nextPieceType = pieceQueue.peek();
    nextPieceCtx.fillStyle = nextPieceType.colour;
    for (const { x: cellX, y: cellY } of nextPieceType.rotations[0]) {
        nextPieceCtx.fillRect(
            CELL_SIZE * cellX,
            flipPreviewY(CELL_SIZE * cellY),
            CELL_SIZE, CELL_SIZE
        );
    }

    // Render score display.
    updateScoreDisplay(state.level, state.score, scoreDisplayEls);

}

export function updateScoreDisplay(level, scoreData, displayEls) {
    displayEls.points.textContent = scoreData.points;
    displayEls.level.textContent = level;
    displayEls.cleared1.textContent = scoreData.cleared1;
    displayEls.cleared2.textContent = scoreData.cleared2;
    displayEls.cleared3.textContent = scoreData.cleared3;
    displayEls.cleared4.textContent = scoreData.cleared4;
    displayEls.clearedTotal.textContent = scoreData.clearedTotal;
    displayEls.highScore.textContent = scoreData.highScore;
    displayEls.highestLevel.textContent = scoreData.highestLevel;
}

function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Canvas co-ords are y-down and drawing context origin is top-left.
function flipWellY(y) {
    return WELL_CANVAS_HEIGHT - CELL_SIZE - y;
}

function flipPreviewY(y) {
    return NEXT_PIECE_CANVAS_SIZE - CELL_SIZE - y;
}