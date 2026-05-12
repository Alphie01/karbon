import fs from 'fs-extra';
import path from 'path';

async function prepareSourceForLinux() {
    const rootDir = process.cwd();
    const distDir = path.join(rootDir, 'linux-deploy');

    console.log("🐧 Preparing Source Code for Linux...");

    // 1. Clean previous build
    if (fs.existsSync(distDir)) {
        fs.removeSync(distDir);
    }
    fs.ensureDirSync(distDir);

    // 2. Create a temporary folder to gather files
    const tempSource = path.join(distDir, 'source');
    fs.ensureDirSync(tempSource);

    // 3. Copy essential files (excluding node_modules, .next, etc.)
    const itemsToCopy = [
        'src',
        'public',
        'prisma',
        'scripts',
        'package.json',
        'package-lock.json',
        'next.config.ts',
        'tsconfig.json',
        '.env', // Caution: Copying env file for convenience, usually risky but requested for easy deploy
        'postcss.config.mjs',
        'eslint.config.mjs',
        'next-env.d.ts',
        'next-env.d.ts',
        'README.md',
        'scripts/setup-server.sh',
        'scripts/nginx-template.conf'
    ];

    console.log("📂 Copying project files...");

    for (const item of itemsToCopy) {
        const srcPath = path.join(rootDir, item);
        const destPath = path.join(tempSource, item);

        if (fs.existsSync(srcPath)) {
            fs.copySync(srcPath, destPath);
        } else {
            console.warn(`⚠️ Warning: ${item} not found, skipping.`);
        }
    }

    // 3.5 Remove dev.db to prevent overwriting production DB
    const devDbPath = path.join(tempSource, 'prisma', 'dev.db');
    if (fs.existsSync(devDbPath)) {
        fs.removeSync(devDbPath);
        console.log("🗑️  Removed local SQLite DB to prevent overwriting production database!");
    }

    // 4. Manual Zip Instruction
    console.log(`
✅ Linux Deployment Files Ready!
📂 Location: ${tempSource}

👉 How to Deploy to Ubuntu (Direct Upload):
1. Open the folder: ${tempSource}
2. Select ALL files inside and create a ZIP file (e.g., 'source-code.zip').
   (Do not zip the folder itself, zip the *contents*)
3. Upload 'source-code.zip' to your server (e.g., /var/www/blt-platform).
4. Run on server:
   unzip source-code.zip
   npm install
   npx prisma generate
   npm run build
   pm2 start npm --name "blt-platform" -- start

👉 VİDEOLARIN KALICI OLMASI İÇİN (Persistent Uploads):
Videoların her deploy'da silinmemesi için \`.env\` dosyanıza şu satırı ekleyin:
UPLOAD_DIR=/var/www/blt-uploads
(Bu klasörü sunucuda oluşturmayı unutmayın: mkdir -p /var/www/blt-uploads)

Ayrıca, sunucudaki NGINX yapılandırmanıza şunu ekleyin:
location /uploads/ {
    alias /var/www/blt-uploads/;
    access_log off;
    expires max;
}
    `);
}

prepareSourceForLinux().catch(console.error);
