#!/bin/bash

# Server Setup Script for Next.js App (Hostinger/Vultr/DigitalOcean)
# Run this script as root

# 1. Update and Upgrade System
echo "🔄 Updating system packages..."
apt update && apt upgrade -y
apt install -y curl git unzip ufw build-essential

# 2. Install Node.js 20
echo "🟢 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install PM2 (Process Manager)
echo "🚀 Installing PM2..."
npm install -g pm2

# 4. Install Nginx
echo "🌐 Installing Nginx..."
apt install -y nginx

# 5. Install Certbot (SSL)
echo "🔒 Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# 6. Install Docker (Optional but recommended for DB)
echo "🐳 Installing Docker & Docker Compose..."
apt install -y docker.io docker-compose
systemctl enable --now docker

# 7. Configure Firewall (UFW)
echo "🛡️ Configuring Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 8. Create App Directory
echo "📂 Creating application directory..."
mkdir -p /var/www/beyondlimitsturkiye.tech
mkdir -p /var/www/blt-uploads
chown -R $USER:$USER /var/www/beyondlimitsturkiye.tech
chown -R $USER:$USER /var/www/blt-uploads

echo "✅ Server setup complete!"
echo "👉 Now upload your project files to /var/www/beyondlimitsturkiye.tech"
echo "👉 Run 'docker-compose up -d' for the database."
