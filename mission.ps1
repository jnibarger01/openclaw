# === MISSION CONTROL LAUNCHER (QUOTE-SAFE) ===

$terminalExe = Get-ChildItem (Get-AppxPackage Microsoft.WindowsTerminal).InstallLocation `
  -Recurse -Filter "WindowsTerminal.exe" -ErrorAction SilentlyContinue |
  Select-Object -First 1 -ExpandProperty FullName

if (-not $terminalExe) {
    Write-Host "Windows Terminal not found." -ForegroundColor Red
    exit 1
}

$w  = "powershell -NoExit -File C:\ai\openclaw\mission\pane-workspace.ps1"
$g  = "powershell -NoExit -File C:\ai\openclaw\mission\pane-gpu.ps1"
$c  = "powershell -NoExit -File C:\ai\openclaw\mission\pane-cpu.ps1"
$log= "powershell -NoExit -File C:\ai\openclaw\mission\pane-log.ps1"

# Pass each argument separately so Windows Terminal parses it correctly
$args = @(
  "new-tab", "--title", "OpenClaw", "powershell", "-NoExit", "-File", "C:\ai\openclaw\mission\pane-workspace.ps1",
  ";", "split-pane", "-H", "powershell", "-NoExit", "-File", "C:\ai\openclaw\mission\pane-gpu.ps1",
  ";", "split-pane", "-V", "powershell", "-NoExit", "-File", "C:\ai\openclaw\mission\pane-cpu.ps1",
  ";", "split-pane", "-H", "powershell", "-NoExit", "-File", "C:\ai\openclaw\mission\pane-log.ps1"
)

Start-Process $terminalExe -ArgumentList $args