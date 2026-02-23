$log = "C:\ai\openclaw\logs\gateway.log"
if (Test-Path $log) {
  Get-Content $log -Wait
} else {
  Write-Host "No gateway.log yet at $log" -ForegroundColor Yellow
  Write-Host "Create it or start your gateway, then re-run mission." -ForegroundColor Yellow
  while ($true) { Start-Sleep 5 }
}
