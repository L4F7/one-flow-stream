/*
    This is the JS generator module of the OFS transpiler.
  
Authors:
  - Kenneth Alfaro Barboza
  - Luis Fuentes Fuentes
  - Luis Eduardo Restrepo Veintemilla
  - Maria Angelica Robles Azofeifa
  - Royer Zuñiga Villareal

Date: 23/11/2023

*/

:- module(generator, [generator/3]).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% GENERATOR %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

generator(JSFilename,  prog(StatementList) , Output) :-
   open(JSFilename, write, Stream),

   get_date_time(Date, Time),
    atomic_list_concat(['Generated by Prolog OFS 2.0 transpiler {', Date, Time, '}'], '', TimeStamp),

   generate_comment(Stream, TimeStamp),

   generate(Stream, imports_mod([id("Iterate")], str("./iterate.mjs"))), !,

   format(Stream, '~n', []),

   forall(member(Statement, StatementList),
            (
               generate(Stream, Statement),
               format(Stream, '~n', [])
            )
         ),
   close(Stream),
   open(JSFilename, read, Stream2),
   read_string(Stream2, _, Output),
   close(Stream2)
.

generate(Stream, single_comment(S)) :-
   format(Stream, '// ~s', [S])
.

generate(Stream, multiple_comment(S)) :-
   format(Stream, '/* ~s */', [S])
.

generate(Stream, imports_mod(id(I), str(S)) ) :-
   format(Stream, 'import ~s from ~s~s~s;~n', [I, "'",S, "'"])
.

generate(Stream, imports_mod(LI, str(S))) :-
   format(Stream, 'import {',[]),
   last(LI, Last),
   forall(member(CLI, LI),
         (CLI == Last -> generate_last(Stream, imports_list(CLI)) ; generate(Stream, imports_list(CLI)))),
   format(Stream, '} from ~s~s~s;~n', ["'", S, "'"])
.

generate(Stream, imports_list(id(I))) :-
   format(Stream, '~s,', [I])
. 
   
generate(Stream, decl(D, id(I))) :-
   format(Stream, '~s ~s; ~n', [D, I])
. 

generate(Stream, decl(D, id(I), expr(E))) :-
   format(Stream, '~s ~s = ', [D, I]),
   generate(Stream, expr(E))
. 

% expression generator
generate(Stream, expr(E)) :- 
   generate(Stream, E)
.

% pipe_expression generator
generate(Stream, pipe_expr(E, Tail)) :- 
   length(Tail, L),
   L > 0 -> 
      last(Tail, Last),
      generate(Stream, E),
      forall(member(CLI, Tail),
         (CLI == Last -> generate(Stream, CLI) ; generate(Stream, CLI)))
      ; generate(Stream, E)
   ,
      true
.

% pipe_expression_tail generator
generate(Stream, pipe_expr_tail(E)) :- 
   format(Stream, '.', []),
   generate(Stream, E)
.

% ofs_expression generator
generate(Stream, ofs_expr(E)) :-
   generate(Stream, E)
.

% iterate_expression generator
generate(Stream, iter_expr(E1, E2)) :-
   format(Stream, 'new Iterate( ', []),
   generate(Stream, E1),
   format(Stream, ', ', []),
   generate(Stream, E2),
   format(Stream, ' )', [])
.

% map_expression generator
generate(Stream, map_expr(E)) :-
   format(Stream, 'map( ', []),
   generate(Stream, E),
   format(Stream, ' )', [])
.

% filter_expression generator
generate(Stream, filter_expr(E)) :-
   format(Stream, 'filter( ', []),
   generate(Stream, E),
   format(Stream, ' )', [])
.

% cut_expression generator
generate(Stream, cut_expr(E)) :-
   format(Stream, 'cut( ', []),
   generate(Stream, E),
   format(Stream, ' )', [])
.

% toLst_expression generator
generate(Stream, toLst_expr(undefined)) :-
   format(Stream, 'toList()', [])
.

% forEach_expression generator
generate(Stream, forEach_expr(E)) :-
   format(Stream, 'forEach( ', []),
   generate(Stream, E),
   format(Stream, ' )', [])
.

% es6_expression generator
generate(Stream, es6_expr(E)) :-
   generate(Stream, E)
.

% boolean_expression generator
generate(Stream, bool_expr(RE, Tail)) :-
   length(Tail, L),
   L > 0 -> 
      last(Tail, Last),
      generate(Stream, RE),
      forall(member(CLI, Tail),
         (CLI == Last -> generate(Stream, CLI) ; generate(Stream, CLI)))
      ; generate(Stream, RE)
   ,
      true
.

% boolean_expression_tail generator
generate(Stream, bool_expr_tail(BO, RE)) :-
   format(Stream, ' ~s ', [BO]),
   generate(Stream, RE)
.

% lambda_expression generator
generate(Stream, lambda_expr(E1, E2)) :-
   generate(Stream, E1),
   format(Stream, ' => ', []),
   generate(Stream, E2)
.

% conditional_expression generator
generate(Stream, cond_expr(RE, E1, E2)) :-
   generate(Stream, RE),
   format(Stream, ' ? ', []),
   generate(Stream, E1),
   format(Stream, ' : ', []),
   generate(Stream, E2)
.

% relational_expression generator   
generate(Stream, rel_expr(AE, Tail)) :-
   length(Tail, L),
   L > 0 -> 
      last(Tail, Last),
      generate(Stream, AE),
      forall(member(CLI, Tail),
         (CLI == Last -> generate(Stream, CLI) ; generate(Stream, CLI), format(Stream, ' ', [])))
      ; generate(Stream, AE)
   ,
      true
.

% relational_expression_tail generator
generate(Stream, rel_expr_tail(RO, AE)) :-
   format(Stream, ' ~s ', [RO]),
   generate(Stream, AE)
.

% arith_expression generator
generate(Stream, arith_expr(FE, Tail)) :-
   length(Tail, L),
   L > 0 -> 
      last(Tail, Last),
      generate(Stream, FE),
      forall(member(CLI, Tail),
         (CLI == Last -> generate(Stream, CLI) ; generate(Stream, CLI), format(Stream, ' ', [])))
      ; generate(Stream, FE)
   ,
      true
.

% arith_expression_tail generator
generate(Stream, arith_expr_tail(AO, FE)) :-
   format(Stream, ' ~s ', [AO]),
   generate(Stream, FE)
.

% factor_expression generator
generate(Stream, factor_expr(PE)) :-
   generate(Stream, PE)
.

% literal_expression generator
generate(Stream, lit_expr(LE)) :-
   generate(Stream, LE)
.

% paren_expression generator
generate(Stream, paren_expr(E)) :-
   format(Stream, '( ', []),
   generate(Stream, E),
   format(Stream, ' )', [])
.

% unary_expression generator
generate(Stream, unary_expr(UO, FE)) :-
   format(Stream, ' ~s ', [UO]),
   generate(Stream, FE)
.

% simple_expression with assignment generator
generate(Stream, simple_expr_assign(QI, E)) :-
   generate(Stream, QI),
   format(Stream, ' = ', []),
   generate(Stream, E)
.

% simple_expression with arguments generator
generate(Stream, simple_expr_args(QI, AE)) :-
   generate(Stream, QI),
   format(Stream, '( ', []),
   generate(Stream, AE),
   format(Stream, ' )', [])
.

% simple_expression generator
generate(Stream, simple_expr(QI)) :-
   generate(Stream, QI)
.

% qualified_id generator
generate(Stream, qual_id(QI, Tail)) :-
   length(Tail, L),
   L > 0 -> 
      last(Tail, Last),
      generate(Stream, QI),
      forall(member(CLI, Tail),
         (CLI == Last -> generate(Stream, CLI) ; generate(Stream, CLI)))
      ; generate(Stream, QI)
   ,
      true
.

% qualified_id_tail with dot generator
generate(Stream, qual_id_tail_dot(QI)) :-
   format(Stream, '.', []),
   generate(Stream, QI)
.

% qualified_id_tail with brackets generator
generate(Stream, qual_id_tail_sqr(QI)) :-
   format(Stream, '[ ', []),
   generate(Stream, QI),
   format(Stream, ' ]', [])
.

% access_expression generator
generate(Stream, access_expr(I)) :-
   generate(Stream, I)
.

% sqr_bracket_access_expression generator
generate(Stream, sqr_access_expr(E)) :-
   generate(Stream, E)
.

% args_expression generator
generate(Stream, args_expr(E, Tail)) :-
   length(Tail, L),
   L > 0 -> 
      last(Tail, Last),
      generate(Stream, E),
      format(Stream, ', ', []),
      forall(member(CLI, Tail),
         (CLI == Last -> generate(Stream, CLI) ; generate(Stream, CLI), format(Stream, ', ', [])))
      ; generate(Stream, E)
   ,
      true 
.

% args_expression_tail generator
generate(Stream, args_expr_tail(E)) :-
   generate(Stream, E)
.

% array_expression generator
generate(Stream, array_expr(E, Tail)) :-
   length(Tail, L),
   L > 0 -> 
      last(Tail, Last),
      generate(Stream, E),
      format(Stream, ' + ', []),
      forall(member(CLI, Tail),
         (CLI == Last -> generate(Stream, CLI) ; generate(Stream, CLI), format(Stream, ' + ', [])))
      ; generate(Stream, E)
   ,
      true
.

% array_expression_contents generator
generate(Stream, array_expr_contents(E, Tail)) :-
   format(Stream, '[ ', []),
   length(Tail, L),
   L > 0 -> 
      last(Tail, Last),
      generate(Stream, E),
      format(Stream, ', ', []),
      forall(member(CLI, Tail),
         (CLI == Last -> generate(Stream, CLI), format(Stream, ' ]', []) ; generate(Stream, CLI), format(Stream, ', ', [])))
      ; generate(Stream, E)
   ,
      format(Stream, ' ]', [])
.

% array_expression_contents empty generator
generate(Stream, array_expr_contents(undefined)) :-
   format(Stream, '[]', [])
.


% array_expression_contents_tail generator
generate(Stream, array_expr_contents_tail(E)) :-
   generate(Stream, E)
.

% array_expression_tail generator
generate(Stream, array_expr_tail(E)) :-
   generate(Stream, E)
.

% params_expression generator
generate(Stream, params_expr(id(I))) :-
   format(Stream, '~s', [I])
. 

% params_expression generator
generate(Stream, params_expr(I, Tail)) :-
   format(Stream, '( ', []),
   length(Tail, L),
   (L > 0 -> 
      last(Tail, Last),
      generate(Stream, I),
      format(Stream, ', ', []),
      forall(member(CLI, Tail),
      (CLI == Last -> generate(Stream, CLI) ; generate(Stream, CLI), format(Stream, ', ', [])))
      ; generate(Stream, I)
   ),
     format(Stream, ' )', [])
.

% params_expression_tail generator
generate(Stream, params_expr_tail(id(I))) :-
   format(Stream, '~s', [I])
. 

% id generator
generate(Stream, id(I)) :-
   format(Stream, '~s', [I])
.

% number generator
generate(Stream, num(N)) :-
   atom_number(N, S),
   format(Stream, '~q', [S])
.

% string generator
generate(Stream, str(S)) :-
   format(Stream, '~s~s~s', ["`",S,"`"])
.

% boolean generator
generate(Stream, bool(B)) :-
   format(Stream, '~s', [B])
. 
 
% undefined generator
generate( Stream, S) :-
   format(Stream, '/* >>>> ~q NOT GENERATED <<<< */~n', [S])
. 

% comment generator
generate_comment(Stream, Comment) :-
   format(Stream, '// ~s~n', [Comment])
.

% last element of a list
generate_last(Stream, imports_list(id(I))) :-
   format(Stream, '~s', [I])
.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% END OF FILE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%