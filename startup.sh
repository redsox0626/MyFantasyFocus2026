#!/bin/sh
set -eu
cd /workspace
if curl -sf -o /dev/null http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev > /tmp/mff-dev.log 2>&1 &
exit 0
