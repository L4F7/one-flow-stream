// iterate.js

class Stream {
    #iterable;

    constructor(iterable) {
        this.#iterable = iterable;
    }

    filter(p) {
        function* gen(iterable) {
            for (const e of iterable) {
                if (p(e)) yield e;
            }
        }
        return new Stream(gen(this.#iterable));
    }

    map(f) {
        function* gen(iterable) {
            for (const e of iterable) {
                yield f(e);
            }
        }
        return new Stream(gen(this.#iterable));
    }

    cut(n) {
        let newIterable = [];
            while (n--) {
                newIterable = [...newIterable, this.#iterable.next().value, ];
            }
        return new Stream(newIterable);
    }

    toList() {
        return [...this.#iterable];
    }
}

export class Iterate extends Stream {
    constructor(init = 0, f = (n => n + 1)) {
        function* iterable() {
            yield init;
            while (true) {
                yield (init = f(init));
            }
        }
        
        super(iterable());
        this.init = init;
        this.f = f;
    }
}