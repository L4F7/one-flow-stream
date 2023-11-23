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

:- module(utils, [eliminate_null/2, get_date_time/2] ).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% UTILS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% get_date_time( -Date, -Time )
get_date_time(Date, Time) :-
    get_time(T), stamp_date_time(T, date(Year, Month, Day, H, M, S, _, _, _), 'UTC'), 
    HourToCST is H - 6,
    SecondsWithoutDecimals is floor(S),
    atomic_list_concat([Year, '-', Month, '-', Day, ' '], '', Date),
    atomic_list_concat([HourToCST, ':', M, ':', SecondsWithoutDecimals], '', Time)
.

% eliminate_null( +List, -ListWithoutNulls )
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

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% END OF FILE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%