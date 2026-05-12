$ErrorActionPreference = "Stop"

$rootDir = Get-Location
$publishDir = Join-Path $rootDir "publish"

Write-Host "Packaging for Windows (Manual Implementation)..."

# 1. Clean
if (Test-Path $publishDir) {
    Write-Host "Cleaning publish directory..."
    Remove-Item -Path $publishDir -Recurse -Force
}
New-Item -ItemType Directory -Path $publishDir | Out-Null

# 2. Copy Standalone
Write-Host "Copying Standalone server..."
Copy-Item -Path ".next/standalone/*" -Destination $publishDir -Recurse -Force

# 3. Copy Static Assets
Write-Host "Copying static assets..."
$staticDest = "$publishDir/.next/static"
if (!(Test-Path $staticDest)) { New-Item -ItemType Directory -Path $staticDest -Force | Out-Null }
Copy-Item -Path ".next/static/*" -Destination $staticDest -Recurse -Force

# 4. Copy Public Folder
Write-Host "Copying public folder..."
$publicDest = "$publishDir/public"
if (!(Test-Path $publicDest)) { New-Item -ItemType Directory -Path $publicDest -Force | Out-Null }
Copy-Item -Path "public/*" -Destination $publicDest -Recurse -Force

# 5. Copy Database
Write-Host "Copying Database..."
$prismaDest = "$publishDir/prisma"
if (!(Test-Path $prismaDest)) { New-Item -ItemType Directory -Path $prismaDest -Force | Out-Null }
Copy-Item -Path "prisma/schema.prisma" -Destination $prismaDest -Force
if (Test-Path "prisma/dev.db") {
    Copy-Item -Path "prisma/dev.db" -Destination $prismaDest -Force
}

# 6. Create Start Script
Write-Host "Creating start.bat..."
$batLines = @(
    "@echo off",
    "title Beyond Limits Platform",
    "echo Starting Application...",
    "echo Please ensure you have Node.js installed.",
    "echo Open http://localhost:3000 in your browser.",
    "",
    ":: Set Production Environment",
    "set NODE_ENV=production",
    "set PORT=3000",
    "set HOSTNAME=localhost",
    "",
    ":: Database URL (Points to local file)",
    "set DATABASE_URL=file:./prisma/dev.db",
    "",
    ":: Start Server",
    "node server.js",
    "pause"
)
$batLines | Set-Content -Path "$publishDir/start.bat"

# 7. Create README
Write-Host "Creating README.txt..."
$readmeLines = @(
    "BEYOND LIMITS PLATFORM - WINDOWS PACKAGE",
    "========================================",
    "",
    "NASIL CALISTIRILIR?",
    "1. Bu klasoru hedef bilgisayara kopyalayin.",
    "2. Hedef bilgisayarda Node.js (v18 veya uzeri) yuklu oldugundan emin olun.",
    "   (Indirmek icin: https://nodejs.org/en/download)",
    "3. 'start.bat' dosyasina cift tiklayin.",
    "4. Tarayicinizda http://localhost:3000 adresine gidin.",
    "",
    "VERITABANI:",
    "- Veriler 'prisma/dev.db' dosyasinda saklanir.",
    "- Bu dosyayi yedekleyebilirsiniz."
)
$readmeLines | Set-Content -Path "$publishDir/README.txt"

Write-Host ""
Write-Host "Packaging Complete!"
Write-Host "Output Folder: $publishDir"
