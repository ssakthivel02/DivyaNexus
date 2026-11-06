$ErrorActionPreference = "Stop"

$Website = "https://divyanexus.omsaravanabhava.org"
$Api = "https://api-divyanexus.omsaravanabhava.org"
$ExpectedService = "divyanexus-api"

$checks = [ordered]@{}

$site = Invoke-WebRequest -Uri "$Website/?validation=$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())" -TimeoutSec 20
$checks.Website = $site.StatusCode -eq 200

$config = Invoke-WebRequest -Uri "$Website/js/config.js?validation=$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())" -TimeoutSec 20
$checks.FrontendConfig = $config.StatusCode -eq 200 -and $config.Content.Contains("$Api/api/v1")

$statusResponse = Invoke-WebRequest -Uri "$Api/api/v1/status?validation=$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())" -Headers @{ Origin = $Website; "Cache-Control" = "no-cache" } -TimeoutSec 20
$status = $statusResponse.Content | ConvertFrom-Json

$checks.Http200 = $statusResponse.StatusCode -eq 200
$checks.Status = $status.status -eq "ok"
$checks.Service = $status.service -eq $ExpectedService
$checks.Environment = $status.environment -eq "production"
$checks.Version = $status.version -eq "1.0.0"
$checks.ApiVersion = $status.apiVersion -eq "v1"
$checks.RequestId = -not [string]::IsNullOrWhiteSpace($statusResponse.Headers["X-Request-ID"])
$checks.Cors = $statusResponse.Headers["Access-Control-Allow-Origin"] -eq $Website

$result = foreach ($entry in $checks.GetEnumerator()) {
    [PSCustomObject]@{
        Check = $entry.Key
        Result = if ($entry.Value) { "PASS" } else { "FAIL" }
    }
}

$result | Format-Table -AutoSize

if ($checks.Values -contains $false) {
    throw "DivyaNexus production validation failed."
}

Write-Host "DivyaNexus production validation passed." -ForegroundColor Green
