$routes = @("/", "/expenses", "/water", "/energy", "/crops", "/tasks", "/livestock", "/inventory", "/reports", "/settings")
foreach ($r in $routes) {
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:3000$r" -UseBasicParsing -TimeoutSec 15
        Write-Host "$r => $($resp.StatusCode)"
    } catch {
        Write-Host "$r => FAIL: $_"
    }
}
