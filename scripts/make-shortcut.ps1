# Creates a "BaonBuddy" shortcut that launches the portable Windows app.
# Usage: powershell -File scripts/make-shortcut.ps1
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root 'release\BaonBuddy\BaonBuddy.exe'
if (-not (Test-Path $target)) {
  throw "Missing $target. Run 'npm run desktop:build' first."
}
$icon = Join-Path $root 'release\BaonBuddy\BaonBuddy.ico'

$shell = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')
foreach ($dir in @((Join-Path $root 'release'), $desktop)) {
  $linkPath = Join-Path $dir 'BaonBuddy.lnk'
  $link = $shell.CreateShortcut($linkPath)
  $link.TargetPath = $target
  $link.WorkingDirectory = Split-Path -Parent $target
  $link.Description = 'BaonBuddy - Budget mo, kontrolado mo.'
  $link.IconLocation = "$icon,0"
  $link.Save()
  Write-Output "Shortcut: $linkPath"
}
