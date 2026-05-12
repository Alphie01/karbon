import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

async function packageForWindows() {
    const rootDir = process.cwd();
    const distDir = path.join(rootDir, 'publish');

    console.log("📦 Packaging for Windows...");

    // 1. Clean previous build
    if (fs.existsSync(distDir)) {
        fs.removeSync(distDir);
    }
    fs.ensureDirSync(distDir);

    // 2. Build Next.js (Standalone)
    console.log("🛠️ Building Project...");
    try {
        execSync('npm run build', { stdio: 'inherit' });
    } catch (e) {
        console.error("❌ Build failed. Fix errors and try again.");
        process.exit(1);
    }

    // 3. Copy Standalone files
    console.log("📂 Copying Standalone server...");
    fs.copySync(path.join(rootDir, '.next/standalone'), distDir);

    // 4. Copy Static Assets (Required for standalone)
    console.log("📂 Copying static assets...");
    const staticSrc = path.join(rootDir, '.next/static');
    const staticDest = path.join(distDir, '.next/static');
    fs.copySync(staticSrc, staticDest);

    // 5. Copy Public Folder
    console.log("📂 Copying public folder...");
    fs.copySync(path.join(rootDir, 'public'), path.join(distDir, 'public'));

    // 6. Copy Database (SQLite) & Prisma Schema
    // In production, you might want to run migrations, but for simple portability we copy the dev.db if it exists
    // or provide the schema to generate a new one.
    console.log("📂 Copying Database...");
    const prismaSrc = path.join(rootDir, 'prisma');
    const prismaDest = path.join(distDir, 'prisma');
    fs.ensureDirSync(prismaDest);

    // Copy schema
    fs.copySync(path.join(prismaSrc, 'schema.prisma'), path.join(prismaDest, 'schema.prisma'));

    // Copy existing Dev DB (Optional - if user wants their data)
    if (fs.existsSync(path.join(prismaSrc, 'dev.db'))) {
        fs.copySync(path.join(prismaSrc, 'dev.db'), path.join(prismaDest, 'dev.db'));
    }

    // 7. Create Start Script (.bat)
    console.log("📝 Creating start.bat...");
    const batContent = `
@echo off
title Beyond Limits Platform
echo Starting Application...
echo Please ensure you have Node.js installed.
echo Open http://localhost:3000 in your browser.

:: Set Production Environment
set NODE_ENV=production
set PORT=3000
set HOSTNAME=localhost

:: Database URL (Points to local file)
set DATABASE_URL=file:./prisma/dev.db

:: Generate Client if needed (rarely needed in standalone if node_modules copied right, but good safety)
:: We assume node_modules are bundled in standalone.

:: Start Server
node server.js
pause
    `.trim();

    fs.writeFileSync(path.join(distDir, 'start.bat'), batContent);

    // 8. Create README
    fs.writeFileSync(path.join(distDir, 'README.txt'), `
BEYOND LIMITS PLATFORM - WINDOWS PACKAGE
========================================

NASIL CALISTIRILIR?
1. Bu klasoru hedef bilgisayara kopyalayin.
2. Hedef bilgisayarda Node.js (v18 veya uzeri) yuklu oldugundan emin olun.
   (Indirmek icin: https://nodejs.org/en/download)
3. "start.bat" dosyasina cift tiklayin.
4. Tarayicinizda http://localhost:3000 adresine gidin.

VERITABANI:
- Veriler "prisma/dev.db" dosyasinda saklanir.
- Bu dosyayi yedekleyebilirsiniz.
    `.trim());

    console.log(`
✅ Packaging Complete!
📂 Output Folder: ${distDir}
👉 You can now zip the 'publish' folder and move it to another machine.
    `);
}

packageForWindows().catch(console.error);
