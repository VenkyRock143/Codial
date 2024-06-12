#!/bin/bash

# Start Redis server
REDIS_SERVER_COMMAND=$(command -v redis-server)
if [ -x "$REDIS_SERVER_COMMAND" ]; then
    $REDIS_SERVER_COMMAND --port 6379 --slaveof 127.0.0.1 6379 &
else
    echo "Error: redis-server command not found."
    exit 1
fi

# Start Node.js application
node index.js
