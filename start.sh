#!/bin/bash

# Start Redis server
redis-server --port 6379 --slaveof red-cpkps0fsc6pc73f27deg 6379 &

# Start Node.js application
node index.js
