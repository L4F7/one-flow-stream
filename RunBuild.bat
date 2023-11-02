@echo off
start cmd /k "swipl simple_service_server.pl"
start cmd /k "npm run build && npm start"
