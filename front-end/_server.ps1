$listener = New-Object Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()
Write-Host 'Server started on http://localhost:8080'

$root = $PSScriptRoot

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $path = $request.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    $filePath = Join-Path $root ($path -replace '/','\')
    
    if (Test-Path $filePath) {
        $ext = [IO.Path]::GetExtension($filePath).ToLower()
        $contentType = switch ($ext) {
            '.html' { 'text/html; charset=utf-8' }
            '.css'  { 'text/css' }
            '.js'   { 'application/javascript' }
            '.jpeg' { 'image/jpeg' }
            '.jpg'  { 'image/jpeg' }
            '.png'  { 'image/png' }
            '.mp4'  { 'video/mp4' }
            '.svg'  { 'image/svg+xml' }
            default { 'application/octet-stream' }
        }
        $response.ContentType = $contentType
        $buffer = [IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    } else {
        $response.StatusCode = 404
        $buffer = [Text.Encoding]::UTF8.GetBytes('Not Found')
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    $response.OutputStream.Close()
}
