@echo off
start cmd /k "swipl prolog/server.pl"
start cmd /k "npm run dev"

:: Add a delay to allow time for the server to start
ping 127.0.0.1 -n 5 > nul

:: Open the browser to localhost:3000
start "" "http://localhost:3000"