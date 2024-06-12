#!/bin/bash

# Start Redis server
redis-server --port 6379 --slaveof 127.0.0.1 6379 &

# Start Node.js application
node index.js
