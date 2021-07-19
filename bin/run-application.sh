#!/bin/bash

RUN_SERVER_LOG=logs/run-server.log
MAX_RETRIES=180
RETRIES=0

stop_server() {
  pids=$(ps -ef | grep node | awk '/node-api-challenge/{print $2}')
  if [ -n "$pids" ]; then
    echo "Stopping all node running apps"
    killall node
  fi
}

wait_until_started() {
  echo "Checking for Node application to start..."

  until [ $(netstat -tulpn | grep -c -E '8000.*LISTEN.*node') -ne 0 ] || [ $(grep -c "ERR" $RUN_SERVER_LOG) -ne 0 ]; do
    echo "Node Application is unavailable - waiting"
    sleep 1

    RETRIES=$((RETRIES + 1))
    if [ $RETRIES -eq $MAX_RETRIES ]; then
      return
    fi
  done

  echo "Node Application started"
}

mkdir -p logs

if [ -f $RUN_SERVER_LOG ]; then
  rm $RUN_SERVER_LOG
fi

stop_server

npm install --silent

npm run app:setup

npm run serve > $RUN_SERVER_LOG&

wait_until_started

exit 0
