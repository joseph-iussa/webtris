export default class Timer {
    constructor(delay) {
        this.delay = delay;
        this.counter = 0;
    }

    reset() {
        this.counter = 0;
    }

    update(dt) {
        this.counter += dt;
    }

    get completionRatio() {
        return Math.min(this.counter / this.delay, 1);
    }

    get ready() {
        return this.counter >= this.delay;
    }
}