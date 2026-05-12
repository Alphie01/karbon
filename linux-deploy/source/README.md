# Beyond Limits Türkiye (BLT) - Corporate Platform

This repository contains the source code for the **Beyond Limits Türkiye (BLT)** corporate web platform and management panel. 
The application is built with modern web technologies, providing a scalable and high-performance environment for tracking corporate sustainability (Carbon & Water footprints), managing CRM processes, providing educational modules, and offering legislation/consulting services.

## 🚀 Tech Stack
- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router & Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Framer Motion
- **Database:** SQLite (managed via [Prisma ORM](https://www.prisma.io/))
- **Authentication:** NextAuth.js (v5)
- **Deployment & Server:** Node.js, Nginx, PM2 (Hostinger VPS)

## 📁 Core Modules
1. **Carbon & Water Footprint Calculator:** Interactive tools to measure and track environmental impact.
2. **CRM & Proposal Management:** Lead tracking, meeting calendar integrations, and financial tracking for admins.
3. **Corporate Dashboard (Multi-tenant):** Secure area for companies to view their specific analysis and reports.
4. **Academy & Legislation:** Educational resources and up-to-date legal documents regarding sustainability.

## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/BLTGroup/BLTG.git
   cd BLTG
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables (Create a `.env` file in the root based on `.env.example` if available).
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Production Deployment
The project is currently deployed on a Hostinger VPS.
- **URL:** [https://beyondlimitsturkiye.tech](https://beyondlimitsturkiye.tech)
- **Process Manager:** PM2 (`pm2 start npm --name "blt" -- run start`)
- **Reverse Proxy:** Nginx (listening on port 80 & 443 with Let's Encrypt SSL)

---
*Developed and maintained by BLT Group.*
