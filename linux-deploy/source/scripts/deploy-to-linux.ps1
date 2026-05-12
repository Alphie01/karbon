$SERVER_IP = "76.13.248.9"
$SERVER_USER = "root"
$SERVER_PASS = ".5Lc&RN2cQexmwLU?ETf"
$REMOTE_DIR = "/var/www/beyondlimitsturkiye.tech"
$LOCAL_TGZ = "linux-deploy/source.tar.gz"
$HOST_KEY = "SHA256:1LlhuwCE3vVlqe3wyKOuz3Hrd42q6W40dvHmDqbhZL8"

Write-Host "Starting Deployment (Tar version)..."

# 1. Package
npm run package:linux

# 2. Create Tarball
Write-Host "Creating Tarball..."
if (Test-Path $LOCAL_TGZ) { Remove-Item $LOCAL_TGZ }
Set-Location "linux-deploy/source"
tar.exe -czf ../source.tar.gz .
Set-Location "../.."

# 3. Upload
Write-Host "Uploading..."
pscp -batch -hostkey $HOST_KEY -pw $SERVER_PASS $LOCAL_TGZ "${SERVER_USER}@${SERVER_IP}:${REMOTE_DIR}/source.tar.gz"

# 4. Remote
Write-Host "Extracting and Building on Server..."
$rc = "cd ${REMOTE_DIR}; tar -xzf source.tar.gz; rm source.tar.gz; npm install --legacy-peer-deps; npx prisma generate; npm run build; cp -r public .next/standalone/; cp -r .next/static .next/standalone/.next/; pm2 restart blt-platform"
plink -batch -hostkey $HOST_KEY -pw $SERVER_PASS "${SERVER_USER}@${SERVER_IP}" $rc

Write-Host "Deployment Successful!"
