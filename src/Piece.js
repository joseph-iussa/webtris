import PIECE_MOVEMENT_STAGE from './PieceMovementStage';
import Position from './Position';

export default class Piece {
    constructor() {
        this.movementStageLeft = PIECE_MOVEMENT_STAGE.NOT_MOVING;
        this.movementStageRight = PIECE_MOVEMENT_STAGE.NOT_MOVING;
        this.pos = new Position();
        this.currentRotationInWellSpace = [
            new Position(), new Position(), new Position(), new Position()
        ];
    }

    init(tetromino) {
        this.type = tetromino;
        this.pos.set(this.type.spawnPos.x, this.type.spawnPos.y);
        this.rotationIdx = 0;
        this.updateCurrentRotationInWellSpace();
    }

    setPos(x, y) {
        this.pos.set(x, y);
        this.updateCurrentRotationInWellSpace();
    }

    get currentRotation() {
        return this.type.rotations[this.rotationIdx];
    }

    set currentRotation(rot) {
        this.rotationIdx = this.type.rotations.findIndex(r => r === rot);
        this.updateCurrentRotationInWellSpace();
    }

    setAll(type, x, y, rotation) {
        this.type = type;
        this.pos.set(x, y);
        this.rotationIdx = this.type.rotations.findIndex(r => r === rotation);
        this.updateCurrentRotationInWellSpace();
    }

    moveLeft() {
        this.pos.x--;
        this.updateCurrentRotationInWellSpace();
    }

    moveRight() {
        this.pos.x++;
        this.updateCurrentRotationInWellSpace();
    }

    moveDown() {
        this.pos.y--;
        this.updateCurrentRotationInWellSpace();
    }

    rotateACW() {
        if (this.rotationIdx === 0) {
            this.rotationIdx = this.type.rotations.length - 1;
        } else {
            this.rotationIdx--;
        }
        this.updateCurrentRotationInWellSpace();
    }

    rotateCW() {
        if (this.rotationIdx === this.type.rotations.length - 1) {
            this.rotationIdx = 0;
        } else {
            this.rotationIdx++;
        }
        this.updateCurrentRotationInWellSpace();
    }

    updateCurrentRotationInWellSpace() {
        this.currentRotation.cells.forEach((cell, idx) => {
            this.currentRotationInWellSpace[idx].set(
                this.pos.x + cell.x,
                this.pos.y + cell.y
            );
        });
    }

    peekNextACWRotation() {
        if (this.rotationIdx === 0) {
            return this.type.rotations[this.type.rotations.length - 1];
        } else {
            return this.type.rotations[this.rotationIdx - 1];
        }
    }

    peekNextCWRotation() {
        if (this.rotationIdx === this.type.rotations.length - 1) {
            return this.type.rotations[0];
        } else {
            return this.type.rotations[this.rotationIdx + 1];
        }
    }
}