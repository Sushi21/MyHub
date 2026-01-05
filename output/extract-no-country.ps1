$json = Get-Content collection.json | ConvertFrom-Json
$noCountry = $json | Where-Object { -not $_.country } | Select-Object artist, album
$noCountry | ConvertTo-Json | Out-File -FilePath "no-country.json" -Encoding UTF8
Write-Host "Exported $($noCountry.Count) albums to no-country.json"
