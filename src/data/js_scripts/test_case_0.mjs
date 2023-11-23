// Generated by Prolog OFS 2.0 transpiler {2023-11-23 -4:28:18}
import {Iterate} from './iterate.mjs';

/* 
 test_case_0.ofs
 // line comment
 multiline comment
 * no pipes *
 import
 let 
 const
 boolean
 relational
 arithmethic
 string
 lambda
 statement expression
 call
 qualified ident
 */
import process from 'node:process';

process.stdout.write( `*** Test Case 0 ***\n` )
const FOUR = 4
let ten = 2 * FOUR  + 1
const printIt = it => console.log( it )
//  A lambda 
printIt( `ten= ` + ten )
//  string and concat
const some_list = [ 1, [ 2, 3, [ 4 ] ], `hola` ]
//  A list and operations
printIt( some_list )
printIt( some_list[ 1 ][ 0 + 1 ] )
printIt( some_list.length )
printIt( some_list.at( -1 ) == `hola` )
printIt( ten / 2 == 5 || ten / 2 != 5 )
