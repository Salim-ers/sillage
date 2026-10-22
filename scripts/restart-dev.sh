#!/bin/bash
# Redémarre le serveur de développement (PID mémorisé dans .dev.pid)
LOG=${1:-/tmp/dev.log}
if [ -f .dev.pid ]; then kill -- -"$(cat .dev.pid)" 2>/dev/null || kill "$(cat .dev.pid)" 2>/dev/null; sleep 1; fi
rm -rf .next
setsid npx next dev -p 3000 > "$LOG" 2>&1 < /dev/null &
echo $! > .dev.pid
for i in $(seq 1 40); do curl -s -o /dev/null http://localhost:3000/favicon.ico && break; sleep 0.5; done
echo "dev prêt"
