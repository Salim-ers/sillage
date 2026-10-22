#!/bin/bash
# Build + démarrage du serveur de production (port 3100), PID mémorisé dans .prod.pid
LOG=${1:-/tmp/prod.log}
if [ -f .prod.pid ]; then kill -- -"$(cat .prod.pid)" 2>/dev/null; sleep 1; fi
npx next build > "$LOG.build" 2>&1 || { tail -30 "$LOG.build"; exit 1; }
grep -E "Compiled|warn" "$LOG.build" | head -5
setsid npx next start -p 3100 > "$LOG" 2>&1 < /dev/null &
echo $! > .prod.pid
for i in $(seq 1 40); do curl -s -o /dev/null http://localhost:3100/robots.txt && break; sleep 0.5; done
echo "prod prêt"
