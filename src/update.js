import {
    PIECE_MOVE_INTERVAL, MAX_PIECE_GRAVITY_FREQUENCY, PIECE_GRAVITY_FREQUENCY_DECREASE_PER_LEVEL,
    WELL_WIDTH, WELL_HEIGHT, POINTS, LEVELS
} from './constants';
import PIECE_MOVEMENT_STAGE from './PieceMovementStage';
import Position from './Position';
import { EMPTY } from './Tetrominos';

export function update(dt, state) {
    const { well, piece, collisionCheckPiece, timers, input, pieceQueue, score } = state;

    // Clear lines.
    if (state.pendingLineClears) {
        state.inLineClearAnim = false;
        timers.lineClearAnim.reset();

        well.clearLines();
        state.pendingLineClears = false;

        // Update score
        score.points += POINTS[`CLEAR_${state.currentClearedLineCount}`] * state.level;
        if (score.points > score.highScore) {
            score.highScore = score.points;
            localStorage.highScore = score.highScore;
        }
        score[`cleared${state.currentClearedLineCount}`]++;
        score.clearedTotal += state.currentClearedLineCount;

        // Update level.
        if (score.clearedTotal >= state.level * 10 && state.level < LEVELS) {
            state.level++;
            if (state.level > score.highestLevel) {
                score.highestLevel = state.level;
                localStorage.highestLevel = score.highestLevel;
            }
            state.gravityFrequency -= PIECE_GRAVITY_FREQUENCY_DECREASE_PER_LEVEL;
            timers.pieceGravity.repeatEvery = state.gravityFrequency;
        }

        spawnPiece(piece, pieceQueue);

        return;
    }

    // Line clear animation.
    if (state.inLineClearAnim) {
        timers.lineClearAnim.update(dt);

        if (timers.lineClearAnim.ready) {
            state.pendingLineClears = true;
        }

        return;
    }

    // Piece lock
    if (state.inPieceLockDelay) {
        timers.pieceLock.update(dt);
        if (timers.pieceLock.ready) {
            timers.pieceGravity.reset();
            lockPiece(piece, well);
            state.inPieceLockDelay = false;

            const clearedLineCount = well.checkLineClears();
            if (clearedLineCount > 0) {
                state.inLineClearAnim = true;
                state.currentClearedLineCount = clearedLineCount;
            } else {
                spawnPiece(piece, pieceQueue);
            }

            return;
        }
    }

    // Gravity
    timers.pieceGravity.update(dt);
    if (timers.pieceGravity.ready) {
        collisionCheckPiece.setAll(
            piece.type,
            piece.pos.x, piece.pos.y - 1,
            piece.currentRotation
        );

        if (collisionOkay(collisionCheckPiece.currentRotationInWellSpace, well)) {
            piece.moveDown();
        }
    }

    // Left
    if (input.pieceLeftKeyDown) {
        collisionCheckPiece.setAll(
            piece.type,
            piece.pos.x - 1, piece.pos.y,
            piece.currentRotation
        );

        const collLeftOkay = collisionOkay(collisionCheckPiece.currentRotationInWellSpace, well);

        switch (piece.movementStageLeft) {
            case PIECE_MOVEMENT_STAGE.NOT_MOVING:
                if (collLeftOkay) {
                    piece.moveLeft();
                }
                piece.movementStageLeft = PIECE_MOVEMENT_STAGE.MOVING;
                break;
            case PIECE_MOVEMENT_STAGE.MOVING:
                timers.pieceLeft.update(dt);
                if (timers.pieceLeft.ready && collLeftOkay) {
                    piece.moveLeft();
                }
                break;
            default:
                break;
        }
    }

    if (input.pieceLeftKeyUp) {
        piece.movementStageLeft = PIECE_MOVEMENT_STAGE.NOT_MOVING;
        timers.pieceLeft.reset();
        input.pieceLeftKeyDown = false;
        input.pieceLeftKeyUp = false;
    }

    // Right
    if (input.pieceRightKeyDown) {
        collisionCheckPiece.setAll(
            piece.type,
            piece.pos.x + 1, piece.pos.y,
            piece.currentRotation
        );

        const collRightOkay = collisionOkay(collisionCheckPiece.currentRotationInWellSpace, well);

        switch (piece.movementStageRight) {
            case PIECE_MOVEMENT_STAGE.NOT_MOVING:
                if (collRightOkay) {
                    piece.moveRight();
                }
                piece.movementStageRight = PIECE_MOVEMENT_STAGE.MOVING;
                break;
            case PIECE_MOVEMENT_STAGE.MOVING:
                timers.pieceRight.update(dt);
                if (timers.pieceRight.ready && collRightOkay) {
                    piece.moveRight();
                }
                break;
            default:
                break;
        }
    }

    if (input.pieceRightKeyUp) {
        piece.movementStageRight = PIECE_MOVEMENT_STAGE.NOT_MOVING;
        timers.pieceRight.reset();
        input.pieceRightKeyDown = false;
        input.pieceRightKeyUp = false;
    }

    // Down
    if (input.pieceDownKeyDown) {
        collisionCheckPiece.setAll(
            piece.type,
            piece.pos.x, piece.pos.y - 1,
            piece.currentRotation
        );

        if (collisionOkay(collisionCheckPiece.currentRotationInWellSpace, well)) {
            piece.moveDown();
        }

        timers.pieceGravity.repeatEvery = MAX_PIECE_GRAVITY_FREQUENCY;
        timers.pieceGravity.reset();
        input.pieceDownKeyDown = false;
    }

    if (input.pieceDownKeyUp) {
        timers.pieceGravity.repeatEvery = state.gravityFrequency;
        timers.pieceGravity.reset();
        input.pieceDownKeyUp = false;
    }

    // Rotate anti-clockwise
    if (input.pieceRotACWKeyDown) {
        collisionCheckPiece.setAll(
            piece.type,
            piece.pos.x, piece.pos.y,
            piece.peekNextACWRotation()
        );

        if (collisionOkay(collisionCheckPiece.currentRotationInWellSpace, well)) {
            piece.rotateACW();
        }

        input.pieceRotACWKeyDown = false;
    }

    // Rotate clockwise
    if (input.pieceRotCWKeyDown) {
        collisionCheckPiece.setAll(
            piece.type,
            piece.pos.x, piece.pos.y,
            piece.peekNextCWRotation()
        );

        if (collisionOkay(collisionCheckPiece.currentRotationInWellSpace, well)) {
            piece.rotateCW();
        }

        input.pieceRotCWKeyDown = false;
    }

    // Check if need to start piece lock.
    if (pieceLockNeeded(piece, well)) {
        if (!state.inPieceLockDelay) {
            state.inPieceLockDelay = true;
            timers.pieceLock.reset();
        }
    } else {
        if (state.inPieceLockDelay) {
            state.inPieceLockDelay = false;
        }
    }
}

function collisionOkay(rotationInWellSpace, well) {
    for (const { x: rotX, y: rotY } of rotationInWellSpace) {
        // Check well left/right edge.
        if (rotX < 0 || rotX >= WELL_WIDTH) {
            return false;
        }

        // Check well bottom edge.
        if (rotY < 0) {
            return false;
        }

        if (well.grid[rotY][rotX] !== EMPTY) {
            return false;
        }
    }

    return true;
}

function pieceLockNeeded(piece, well) {
    for (const { x, y } of piece.currentRotationInWellSpace) {
        // Check for filled cell.
        if (y > 0 && well.grid[y - 1][x] !== EMPTY) {
            return true;
        }

        // Check for well bottom.
        if (y === 0) {
            return true;
        }
    }

    return false;
}

function lockPiece(piece, well) {
    for (const { x, y } of piece.currentRotationInWellSpace) {
        well.grid[y][x] = piece.type;
    }
}

function spawnPiece(piece, pieceQueue) {
    piece.init(pieceQueue.pop());
}