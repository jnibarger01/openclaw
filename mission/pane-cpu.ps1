while ($true) {
  Clear-Host
  Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 |
    Format-Table -AutoSize Name, Id, CPU, WS
  Start-Sleep 3
}
