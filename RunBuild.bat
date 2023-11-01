@echo off
start cmd /c "npm run build && npm start"
start cmd /k "swipl simple_service_server.pl"
