Set-Location "C:\ai\openclaw"

Write-Host "`n=== REPO STATUS WATCHER ===" -ForegroundColor Green
Write-Host "Updates every 5 seconds...`n" -ForegroundColor DarkGray

while ($true) {
    Clear-Host
    Write-Host "=== REPO STATUS ===" -ForegroundColor Green
    git status
    Start-Sleep 5
}