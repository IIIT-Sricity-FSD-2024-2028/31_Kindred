param([switch] $NoBrowser)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$frontendRoot = Join-Path $projectRoot 'front-end'
$backendRoot = Join-Path $projectRoot 'back-end'
$logRoot = Join-Path $projectRoot '.run'
$nodeCommand = Get-Command node -ErrorAction Stop

if (-not (Test-Path -LiteralPath (Join-Path $frontendRoot 'node_modules/vite/bin/vite.js'))) {
    throw 'Frontend dependencies are missing. Run npm ci in front-end, then start again.'
}
if (-not (Test-Path -LiteralPath (Join-Path $backendRoot 'dist/main.js'))) {
    throw 'Backend build is missing. Run npm ci and npm run build in back-end, then start again.'
}
New-Item -ItemType Directory -Path $logRoot -Force | Out-Null

function Test-ServiceReady([string] $Url, [string] $ExpectedText) {
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -eq 200 -and $response.Content.Contains($ExpectedText)
    } catch { return $false }
}

function Test-PortOpen([int] $Port) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $task = $client.ConnectAsync('127.0.0.1', $Port)
        return $task.Wait(500) -and $client.Connected
    } catch { return $false } finally { $client.Dispose() }
}

function Wait-ServiceReady([string] $Url, [string] $ExpectedText, $Process) {
    $deadline = (Get-Date).AddSeconds(45)
    do {
        if (Test-ServiceReady $Url $ExpectedText) { return }
        if ($Process -and $Process.HasExited) { throw "Server exited. Check logs in $logRoot" }
        Start-Sleep -Milliseconds 500
    } while ((Get-Date) -lt $deadline)
    throw "Server did not become ready at $Url. Check logs in $logRoot"
}

$backendUrl = 'http://localhost:3000/organizations'
if (-not (Test-ServiceReady $backendUrl '"success":true')) {
    if (Test-PortOpen 3000) { throw 'Port 3000 is occupied by another service.' }
    $backendProcess = Start-Process -FilePath $nodeCommand.Source -ArgumentList @('dist/main.js') -WorkingDirectory $backendRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logRoot 'backend.stdout.log') -RedirectStandardError (Join-Path $logRoot 'backend.stderr.log')
    Wait-ServiceReady $backendUrl '"success":true' $backendProcess
}

$frontendUrl = 'http://127.0.0.1:5173/'
if (-not (Test-ServiceReady $frontendUrl '/src/main.jsx')) {
    if (Test-PortOpen 5173) { throw 'Port 5173 is occupied by another service.' }
    $frontendProcess = Start-Process -FilePath $nodeCommand.Source -ArgumentList @('node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5173', '--strictPort') -WorkingDirectory $frontendRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logRoot 'frontend.stdout.log') -RedirectStandardError (Join-Path $logRoot 'frontend.stderr.log')
    Wait-ServiceReady $frontendUrl '/src/main.jsx' $frontendProcess
}

Write-Host "Kindred React: $frontendUrl"
Write-Host 'Kindred API: http://localhost:3000'
Write-Host "Server logs: $logRoot"
# Opening the site is the launcher's explicit purpose; server windows stay hidden.
if (-not $NoBrowser) { Start-Process $frontendUrl }
