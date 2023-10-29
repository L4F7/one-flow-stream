class Nats {
    constructor(init = 0, max = Infinity, increment = 1) {
        this.init = init;
        this.max = max;
        this.increment = increment;
    }

    generate(){
        function* gen(init, max, increment){
            let n = init - increment;

            while(n<max){
                yield n+=increment;
            }
        }
        return gen(this.init, this.max, this.increment)
    }

    toList(){
        return [...this.generate()]
    }
}


module.exports = {
	Nats
}