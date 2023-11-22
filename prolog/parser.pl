/*
    This is the main file of the project.
    It is in charge of reading the file, parsing it and generating the JS code.
  
Authors:
  - Kenneth Alfaro Barboza
  - Luis Fuentes Fuentes
  - Luis Eduardo Restrepo Veintemilla
  - Maria Angelica Robles Azofeifa
  - Royer Zuñiga Villareal

Date: 23/11/2023

*/

:- module(parser, [parse/2]).
:- use_module(lexer).
:- use_module(generator).
:- use_module(utils).

%%%%%%%%%%%%%%%%%%%%%%% PARSER %%%%%%%%%%%%%%%%%%%%%%%%
ofs_program( prog(StatementList) ) --> statements( StatementList ).


statements( [S | RS] ) --> statement(S), statements(RS).
statements( [] ) --> [].


statement(T) --> single_cmt(T).
statement(T) --> multiple_cmt(T).
statement(T) --> import_Module(T).
statement(T) --> declaration(T).
statement(T) --> expression(T).
statement(null) --> empty.


% A comment is a "//" followed by any number of characters followed by a newline.
single_cmt(single_comment(T)) --> wss, "//", single_cmt_tail(CT), "\n", wss, {string_codes(T, CT)}.
single_cmt_tail([]) --> [].
single_cmt_tail(T) --> [S], { S \= 10 }, single_cmt_tail(ACT), {append([S], ACT, T)}. % 10 = \n


% A comment is a "/* " followed by any number of characters followed by a "*/".
multiple_cmt(multiple_comment(T)) --> wss, "/*", multiple_cmt_tail(CT), "*/", wss, {string_codes(T, CT)}.
multiple_cmt_tail([]) --> [].
multiple_cmt_tail(T) --> [S], multiple_cmt_tail(ACT), {append([S], ACT, T)}.


% An import is the keyword "import" followed by a module name and a string.
import_Module( imports_mod(IS, S) ) --> import, import_symbols(IS), from, str(S).
import_Module( null ) --> empty.


declaration( decl(D, I) ) --> declarator(D), idntr(I).
declaration( decl(D, I, E) ) --> declarator(D), idntr(I), assignment, expression(E).


declarator(T) --> let(T); const(T).


expression( expr(E) ) --> pipe_expression(E).


pipe_expression( pipe_expr(E, Tail) ) --> ofs_expression(E), pipe_expression_tail(Tail).

pipe_expression_tail( [pipe_expr_tail(E) | Tail] ) --> pipe, ofs_expression(E), pipe_expression_tail(Tail).
pipe_expression_tail([]) --> [].


ofs_expression( ofs_expr(E) ) --> iterate_expression(E).
ofs_expression( ofs_expr(E) ) --> map_expression(E).
ofs_expression( ofs_expr(E) ) --> filter_expression(E).
ofs_expression( ofs_expr(E) ) --> cut_expression(E).
ofs_expression( ofs_expr(E) ) --> es6_expression(E).


iterate_expression( iter_expr(E1, E2) ) --> iterateOptr, expression(E1), comma , expression(E2), close_sqr_bracket.
map_expression( map_expr(E) ) --> mapOptr, expression(E), close_sqr_bracket.
filter_expression( filter_expr(E) ) --> filterOptr, expression(E), close_sqr_bracket.
cut_expression( cut_expr(E) ) --> cutOptr, expression(E), close_sqr_bracket.


es6_expression( es6_expr(E) ) --> boolean_expression(E).
es6_expression( es6_expr(E) ) --> lambda_expression(E).
es6_expression( es6_expr(E) ) --> conditional_expression(E).


boolean_expression( bool_expr(RE, Tail) ) --> relational_expression(RE), boolean_expression_tail(Tail).
boolean_expression_tail( [bool_expr_tail(BO, RE) | Tail] ) --> bool_optr(BO), relational_expression(RE), boolean_expression_tail(Tail), !.
boolean_expression_tail([]) --> [].


relational_expression( rel_expr(AE, Tail) ) --> arith_expression(AE), relational_expression_tail(Tail).

relational_expression_tail( [rel_expr_tail(RO, AE) | Tail] ) --> rel_optr(RO), arith_expression(AE), relational_expression_tail(Tail).
relational_expression_tail([]) --> [].


conditional_expression( cond_expr(RE, E1, E2) ) --> relational_expression(RE), condition, expression(E1), else, expression(E2).


arith_expression( arith_expr(FE, Tail) ) --> factor_expression(FE), arith_expression_tail(Tail).

arith_expression_tail( [arith_expr_tail(AO, FE) | Tail] ) --> arith_optr(AO), factor_expression(FE), arith_expression_tail(Tail).
arith_expression_tail([]) --> [].


factor_expression( factor_expr(PE) ) --> literal_expression(PE).
factor_expression( factor_expr(PE) ) --> paren_expression(PE).
factor_expression( factor_expr(PE) ) --> unary_expression(PE).
factor_expression( factor_expr(PE) ) --> simple_expression(PE).
factor_expression( factor_expr(PE) ) --> array_expression(PE).


literal_expression( lit_expr(T) ) --> num(T); str(T); bool(T).


simple_expression( simple_expr_assign(QI, E) ) --> qualifiable_id(QI), assignment, expression(E).
simple_expression( simple_expr_args(QI, AE) ) --> qualifiable_id(QI), args_expression(AE).
simple_expression( simple_expr(QI) ) --> qualifiable_id(QI).

paren_expression( paren_expr(PE) ) --> open_bracket, expression(PE), close_bracket.

unary_expression( unary_expr(UO, PE) ) --> unary_optr(UO), expression(PE).

qualifiable_id( qual_id(QI, Tail) ) --> access_expression(QI), qualifiable_id_tail(Tail).


qualifiable_id_tail( [qual_id_tail_dot(QI) | Tail] ) --> dot, access_expression(QI), qualifiable_id_tail(Tail).
qualifiable_id_tail( [qual_id_tail_sqr(QI) | Tail] ) --> sqr_bracket_access_expression(QI), qualifiable_id_tail(Tail).
qualifiable_id_tail([]) --> [].


args_expression( args_expr(E, Tail) ) --> open_bracket, expression(E), args_expression_tail(Tail), close_bracket.

args_expression_tail( [args_expr_tail(E) | Tail] ) --> comma, expression(E), args_expression_tail(Tail).
args_expression_tail([]) --> [].


access_expression( access_expr(I) ) --> idntr(I).
%access_expression( access_expr(E) ) --> sqr_bracket_access_expression(E).


sqr_bracket_access_expression( sqr_access_expr(E) ) --> open_sqr_bracket , expression(E), close_sqr_bracket.


array_expression( array_expr(AEC, Tail) ) --> open_sqr_bracket, array_expression_contents(AEC), close_sqr_bracket, array_expression_tail(Tail).


array_expression_tail( [array_expr_tail(E) | Tail] ) --> plusOptr, expression(E), array_expression_tail(Tail).
array_expression_tail([]) --> [].


array_expression_contents( array_expr_contents(E, Tail) ) --> expression(E), array_expression_contents_tail(Tail).
array_expression_contents( array_expr_contents(undefined) ) --> [].


array_expression_contents_tail( [array_expr_contents_tail(PE) | AET] ) --> comma, expression(PE), array_expression_contents_tail(AET).
array_expression_contents_tail([]) --> [].


lambda_expression( lambda_expr(PE, E) ) --> params_expression(PE), arrow, expression(E).


params_expression(params_expr(I)) --> idntr(I).
params_expression(params_expr(I, Tail)) --> open_bracket, idntr(I), params_expression_tail(Tail), close_bracket.

params_expression_tail([params_expr_tail(I) | Tail]) --> comma, idntr(I), params_expression_tail(Tail).
params_expression_tail([]) --> [].

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% PARSER CALLING %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

parse(OFSCode, JSCode) :-
  %writeln('\n*** Parsing your OFS Code ***'),
  string_codes(OFSCode, Codes),
  ofs_program(Ast, Codes, []), !,
  %format('~n*** ~s was correctly parsed! Yeeahh ***~n', [OFSCode]),
  purify(Ast, AstPurified),
  %writeln('\n*** Purified AST ***'),
  %format('~n ~q ~n', [AstPurified]),
  %writeln('\n*** Generating JS ***\n'),
  atomic_list_concat(["tempTranspiled", mjs], '.', JSFilename),
  generator(JSFilename, AstPurified, JSCode)
  %writeln('*** Done ***\n'),
  %writeln(JSCode),
.

parse(OFSCode, JSCode) :- 
    fail
    %format('~n*** ~s was NOT correctly parsed! Buaahh ***~n', [OFSCode])
.

purify(Ast, AstPurified) :-
    eliminate_null(Ast, AstPurified)
.