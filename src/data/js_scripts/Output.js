import {Iterate} from './iterate.mjs';

console.log('hola test 2');
const nats = new Iterate( 0, n => n + 1);
const even = nats.filter((n) => n % 2 === 0);
const evenGreaterThanTen = even.filter((n) => n > 10);
const onlyFiveAfterTen = evenGreaterThanTen.cut(5);
onlyFiveAfterTen.map((n) => console.log(n)).toList();