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

Based on the code provided by Carlos Loría-Sáenz
Original author: loriacarlos@gmail.com

*/
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_log)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/html_write)).
:- use_module(library(readutil)).
:- use_module(parser).
:- use_module(utils).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% SERVER FUNCTIONS %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% URL handlers.
:- http_handler('/compile', handle_request, [method(post)]).
:- http_handler('/', home, []).

handle_request(Request) :-
    http_read_json_dict(Request, Query),
    compile(Query, Solution),
    reply_json_dict(Solution).

server(Port) :-
    http_server(http_dispatch, [port(Port)]).

set_setting(http:logfile, 'service_log_file.log').

%%%%%%%%%%%%%%%%%%%%%%%%%% LOGIC %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Calls evaluation.
compile(_{code: Code}, _{status: true, code:JSCode, msg:'succeed'}) :-
    parse(Code, JSCodetemp),
    atomic_list_concat([JSCodetemp], '', JSCode)
.
compile(_, _{accepted: false, answer:0, msg:'Error: failed evaluation'}).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

home(_Request) :-
        reply_html_page(title('Mini Add Service'),
                        [ h1('To use it:'),
                          p([h4('Send a post messsage'),
                             h4('URI:/add'),
                             h4('body: JSON data of the form {"a":number, "b":number}'),
                             h4('Service Responds with JSON as follows:'),
                             ul([li('{accepted:true, answer:a+b}    if data ok'),
                                 li('{accepted:false, answer:0, msg:some_error_message} othwerwise')])
                            ])
                        ]).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% MAIN %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
:- initialization
    format('*** Starting Server ***~n', []),
    (current_prolog_flag(argv, [SPort | _]) -> true ; SPort='8000'),
    atom_number(SPort, Port),
    format('*** Serving on port ~d *** ~n', [Port]),
    set_setting_default(http:cors, [*]), % Allows cors for every
    server(Port).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
