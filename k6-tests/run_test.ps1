param (
    [string]$scriptPath = "search/01_smoke.js"
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportName = $scriptPath -replace "/", "_" -replace ".js", ""
$htmlFileName = "${timestamp}_${reportName}_dashboard.html"

New-Item -ItemType Directory -Force -Path "reports" | Out-Null

docker run --rm `
  -e BASE_URL="http://j14d105.p.ssafy.io:8080/api/v1" `
  -e TEST_TIMESTAMP=$timestamp `
  -e K6_WEB_DASHBOARD=true `
  -e K6_WEB_DASHBOARD_EXPORT="reports/$htmlFileName" `
  -v "${PWD}:/scripts" `
  -w /scripts `
  grafana/k6 run `
  --out influxdb=http://j14d105.p.ssafy.io:8086/k6 `
  $scriptPath
