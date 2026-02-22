$ErrorActionPreference = "Stop"
$env:DATABASE_URL="postgresql://jaceclaw_user:***@dpg-d6d6erstgctc73ev2fgg-a.virginia-postgres.render.com/jaceclaw"
$env:OPENCLAW_STATE_DIR="C:\ai\openclaw\.state-jaceclaw"
cd "C:\ai\openclaw"
node .\scripts\run-node.mjs gateway