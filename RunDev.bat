@echo off
start cmd /k "swipl simple_service_server.pl"
start cmd /k "npm run dev"

:: Add a delay to allow time for the server to start
ping 127.0.0.1 -n 10 > nul

:: Open the browser to localhost:3000
start "" "http://localhost:3000"