/*
    This is the lexer module of the compiler.
  
Authors:
  - Kenneth Alfaro Barboza
  - Luis Fuentes Fuentes
  - Luis Eduardo Restrepo Veintemilla
  - Maria Angelica Robles Azofeifa
  - Royer Zuñiga Villareal

Date: 23/11/2023

*/

:- module(lexer, 
            [
                declarator/3,
                import/2,
                from/2,
                semicolon/2,
                assignment/2,
                pipe/2,
                comma/2,
                open_sqr_bracket/2,
                close_sqr_bracket/2,
                open_bracket/2,
                close_bracket/2,
                dot/2,
                empty/2,
                plusOptr/2,
                arrow/2,
                else/2,
                condition/2,
                iterateOptr/2,
                filterOptr/2,
                mapOptr/2,
                cutOptr/2,
                toLstOptr/2,
                forEachOptr/2,
                ws/2,
                wss/2,
                sign/3,
                idntr/3,
                num/3,
                bool/3,
                str/3,
                rel_optr/3,
                bool_optr/3,
                unary_optr/3,
                arith_optr/3,
                import_symbols/3
            ]).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% LEXER %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Let and const.
let("let") --> wss, "let", ws, wss.
const("const") --> wss, "const", ws, wss.
declarator(T) --> let(T); const(T).

% Misc.
import --> wss, "import", wss.
from --> wss, "from", wss.
semicolon --> wss, ";", wss.
assignment --> wss, "=", wss.
pipe --> wss, ">>", wss.
comma --> wss, ",", wss.
open_sqr_bracket --> wss, "[", wss.
close_sqr_bracket --> wss, "]", wss.
open_bracket --> wss, "(", wss.
close_bracket --> wss, ")", wss.
dot --> wss, ".", wss.
empty --> wss, ";", wss.
plusOptr --> wss, "+", wss.
arrow --> wss, "->", wss.
else --> wss, ":", wss.
condition --> wss, "?", wss.

% Higher order functions.
iterateOptr --> wss, "[*", wss.
filterOptr --> wss, "[?", wss.
mapOptr --> wss, "[>", wss.
cutOptr --> wss, "[!", wss.
toLstOptr --> wss, "[...]", wss.
forEachOptr --> wss, "[/", wss.

% Whitespace characters.
ws --> " " ; "\n" ; "\r" ; "\t".

% Zero or more whitespaces.
wss --> [].
wss --> ws, wss.

% Sign of an element.
sign(S) --> "+", {char_code('+', S)}.
sign(S) --> "-", {char_code('-', S)}.

% An identifier is a letter followed by any number of letters or digits.
idntr( id(T) ) --> wss, idntr_char(I), idntr_tail(IT), wss, {string_codes(T, [I|IT])}.
idntr_tail(IT) --> idntr_char_tail(I), idntr_tail(AIT), {append([I], AIT, IT)}, !.
idntr_tail([]) --> [].

% Identifier characters.
idntr_char(C) --> letter(C).
idntr_char(C) --> [C], {char_code(CH, C), CH = '_'}.
idntr_char(C) --> [C], {char_code(CH, C), CH = '$'}.

idntr_char_tail(C) --> idntr_char(C).
idntr_char_tail(C) --> digit(C).

% Number. A number is a digit followed by any number of digits or a point followed by any number of digits.
num(num(T)) --> wss, digit(D), num_tail(NT), wss, {string_codes(T, [D | NT])}.
num(num(T)) --> wss, sign(S), digit(D), num_tail(NT), wss, {string_codes(T, [S | [D | NT]])}.

num_tail([D | ANT]) --> digit(D), num_tail(ANT).
num_tail([P | ANT]) --> ".", ptn_num_tail(ANT), {char_to_code(".", P)}.
num_tail([]) --> [].

ptn_num_tail([]) --> [].
ptn_num_tail(NT) --> digit(D), ptn_num_tail(PNT), {append([D], PNT, NT)}.

% A boolean is either "true" or "false".
bool(bool("true")) --> wss, "true", wss, {string_codes("true", _S)}.
bool(bool("false")) --> wss, "false", wss, {string_codes("false", _S)}.

% A string is a single quote followed by any number of characters followed by a single quote.
str( str(S) ) --> wss, "'", str_tail(ST), "'", wss, {string_codes(S, ST)}.
str_tail([]) --> [].
str_tail(ST) --> [C], {C \= 39}, str_tail(AST), {append([C],AST, ST)}.

% A list...
list(lst(C)) --> "[", sqr_bracket_content(C), "]".
list(lst( sgn(O), C)) --> sign(S), "[", sqr_bracket_content(C), "]", {char_code(O, S)}.

list_elmnt(E) -->  wss, (bool(E); idntr(E); num(E); sgn_idntr(E); str(E); list(E)), wss.

sqr_bracket_content( [] ) --> [].
sqr_bracket_content( [E | AE] ) --> list_elmnt(E), after_element(AE).

after_element([]) --> [].
after_element( E ) --> ",", sqr_bracket_content( E ).

% Digit is any digit and letter is any letter.
digit(D) --> [D], {code_type(D, digit)}.
letter(L) --> [L], {code_type(L, alpha)}.

char_to_code(I, O) :- string_codes(I, [O]).

% Relational operators.
rel_optr("<") --> wss, "<", wss, {string_codes("<", _S)}.
rel_optr(">") --> wss, ">", wss, {string_codes(">", _S)}.
rel_optr("==") --> wss, "==", wss, {string_codes("==", _S)}.
rel_optr("!=") --> wss, "!=", wss, {string_codes("!=", _S)}.
rel_optr("<=") --> wss, "<=", wss, {string_codes("<=", _S)}.
rel_optr(">=") --> wss, ">=", wss, {string_codes(">=", _S)}.

% Boolean operators.
bool_and("&&") --> wss, "&&", wss, {string_codes("&&", _O)}.
bool_or("||") --> wss, "||", wss, {string_codes("||", _O)}.
bool_optr(B) --> bool_and(B); bool_or(B).

% Unary operators.
unary_optr("!") --> wss, "!", wss, {string_codes("!", _S)}.
unary_optr("-") --> wss, "-", wss, {string_codes("-", _S)}.

% Arithmetic operators.
arith_optr("+") --> wss, "+", wss, {string_codes("+", _S)}.
arith_optr("-") --> wss, "-", wss, {string_codes("-", _S)}.
arith_optr("*") --> wss, "*", wss, {string_codes("*", _S)}.
arith_optr("/") --> wss, "/", wss, {string_codes("/", _S)}.
arith_optr("%") --> wss, "%", wss, {string_codes("%", _S)}.

% Import symbols
import_symbols( [I | IST] ) --> wss, "{", idntr(I), import_symbols_tail(IST), "}", wss.
import_symbols(I) --> ws, idntr(I), ws.

import_symbols_tail( [I | IST] ) --> ",", idntr(I), import_symbols_tail( IST ).
import_symbols_tail( [] ) --> [].


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% END OF FILE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%