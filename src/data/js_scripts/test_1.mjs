import {Iterate} from './iterate.mjs';

const nats = new Iterate( 0, n => n + 1);
const even = nats.filter( n => n % 2 === 0);
const evenLessThanEleven = even.filter( n => n < 11);
evenLessThanEleven.map( n => console.log(n)).cut(5);
