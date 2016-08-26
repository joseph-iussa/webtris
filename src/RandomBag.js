import { knuthShuffle } from 'knuth-shuffle';

export default class RandomBag {
    constructor(items) {
        this.items = [...items];
        this.idx = 0;
        this.shuffle();
    }

    shuffle() {
        knuthShuffle(this.items);
        this.idx = 0;
    }

    peek() {
        if (this.idx >= this.items.length) {
            this.shuffle();
        }

        return this.items[this.idx];
    }

    pop() {
        if (this.idx >= this.items.length) {
            this.shuffle();
        }

        return this.items[this.idx++];
    }
}