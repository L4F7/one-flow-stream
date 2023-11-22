/*
    This is the utils module of the OFS compiler.
  
Authors:
  - Kenneth Alfaro Barboza
  - Luis Fuentes Fuentes
  - Luis Eduardo Restrepo Veintemilla
  - Maria Angelica Robles Azofeifa
  - Royer Zuñiga Villareal

Date: 23/11/2023

*/

:- module(utils, [eliminate_null/2, concat_ids/2, concat_lst_elements/2, get_date_time/2] ).

%%%%%%%%%%%%%%%%%%%%%%%% UTILS %%%%%%%%%%%%%%%%%%%%%%

get_date_time(Date, Time) :-
    get_time(T), stamp_date_time(T, date(Year, Month, Day, H, M, S, _, _, _), 'UTC'), 
    HourToCST is H - 6,
    SecondsWithoutDecimals is floor(S),
    atomic_list_concat([Year, '-', Month, '-', Day, ' '], '', Date),
    atomic_list_concat([HourToCST, ':', M, ':', SecondsWithoutDecimals], '', Time)
.

eliminate_null( prog(LS), prog(LSWithoutNulls) ) :- 
    eliminate_null_from_list(LS, LSWithoutNulls)
.

eliminate_null_from_list([], []).

eliminate_null_from_list( [null |  RS], RSWithoutNulls ) :- !,
     eliminate_null_from_list( RS, RSWithoutNulls )
.

eliminate_null_from_list( [S | RS], [S | RSWithoutNulls ] ) :-
     eliminate_null_from_list( RS, RSWithoutNulls )
.

concat_ids([], '').
concat_ids([id(X)], X).
concat_ids([id(X)|T], Result) :-
    concat_ids(T, Temp),
    string_concat(X, ', ', Xcomma),
    string_concat(Xcomma, Temp, Result)
.

extract_content(bool(X), X).
extract_content(id(X), X).
extract_content(num(X), X).
extract_content(str(X), T) :- string_concat("'", X, Temp), string_concat(Temp, "'", T).
extract_content(lst(X), T) :- concat_lst_elements(X, Temp), string_concat('[', Temp, Temp2), string_concat(Temp2, ']', T).
extract_content(lst(sgn(S), X), T) :- concat_lst_elements(X, Temp), string_concat('[', Temp, Temp2), string_concat(Temp2, ']', Temp3), string_concat(S, Temp3, T).

concat_lst_elements([], '').
concat_lst_elements([H], Result) :-
    extract_content(H, Content),
    string_concat(Content, '', Result)
.
concat_lst_elements([H|T], Result) :-
    extract_content(H, Content),
    concat_lst_elements(T, Temp),
    string_concat(Content, ', ', ContentComma),
    string_concat(ContentComma, Temp, Result)
.