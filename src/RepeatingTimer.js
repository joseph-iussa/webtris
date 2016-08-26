export default class RepeatingTimer {
    constructor(repeatEvery) {
        this.repeatEvery = repeatEvery;
        this.counter = 0;
        this.readyCount = 0;
    }

    reset() {
        this.counter = 0;
        this.readyCount = 0;
    }

    update(dt) {
        this.counter += dt;
        if (this.counter >= this.repeatEvery) {
            this.readyCount++;
            this.counter -= this.repeatEvery;
        }
    }

    get ready() {
        if (this.readyCount > 0) {
            this.readyCount--;
            return true;
        }

        return false;
    }
}