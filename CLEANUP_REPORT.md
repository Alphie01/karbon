# EcoPilot Project — Root Directory Cleanup Report

**Date:** 2026-05-12
**Project:** EcoPilot (formerly BLT / Beyond Limits Türkiye)
**Stack:** Next.js 16, PostgreSQL (Prisma ORM), NextAuth.js v5, Tailwind CSS v4

---

## Overview

This report documents the cleanup of temporary, debug, and maintenance files that accumulated in the project root directory during development and initial server deployment. These files carry no runtime value, expose internal details, and add noise to the repository. Each file's category and removal rationale are described below.

---

## Files Identified for Deletion

### 1. Debug & One-Off Database Scripts

| File | Reason for Removal |
|---|---|
| `check_users.js` | Ad-hoc script to inspect user records during development. Superseded by Prisma Studio and proper seed scripts. |
| `tmp_check_db2.js` | Temporary database connectivity check. No longer needed once the connection was verified. |
| `tmp_check_users.js` | Duplicate of `check_users.js`; created during a debugging session. |
| `fix_db.sh` | One-time Bash script used to correct a schema or data issue. The fix has been applied; the script is now stale. |
| `fix_videos.js` | One-time migration script to repair video records. Migration is complete; retaining it risks accidental re-runs. |
| `update_roles.js` | Bulk role-update script used during initial user setup. Role management is now handled via the admin UI and seed scripts in `scripts/`. |
| `set_superadmin.js` | Used once to bootstrap the first super-admin account. Keeping this in the root is a security liability. |
| `temp_admin_clean.js` | Temporary admin account cleanup script. Single-use; already executed. |
| `temp_admin_utf8.js` | UTF-8 variant of `temp_admin_clean.js`. Single-use. |
| `remote_check.js` | Script that probed a remote database or API endpoint during debugging. |

### 2. Log Files

| File | Reason for Removal |
|---|---|
| `error.log` | Runtime error log captured outside the application logging pipeline. Should be managed by PM2/Docker, not committed. |
| `build_err.log` | Stale Next.js build error log. Build output should not be committed to source control. |
| `build_error.log` | Duplicate of `build_err.log`. |
| `build_error2.log` | Second iteration of the same build error log. |
| `tsc_output_full.log` | Full TypeScript compiler output captured during a debugging session. Regenerated on every `tsc` run. |
| `typescript-errors.txt` | Manual snapshot of TypeScript errors. Stale and misleading once errors are fixed. |
| `mail.err` | Nodemailer or SMTP error log created during email configuration. |
| `out.txt` | Generic terminal output redirected to file. Contains no reproducible value. |
| `out2.txt` | Second capture of terminal output. Same reasoning. |

### 3. Mail & Server Configuration Fragments

| File | Reason for Removal |
|---|---|
| `dkim_setup.sh` | DKIM key generation script for the mail server. One-time setup; DKIM keys are now installed on the server. |
| `mail_setup.sh` | Postfix/mail server initial setup script. Should live in server documentation, not the application repository. |
| `main.cf` | Postfix `main.cf` fragment copied from the server for reference. Committing mail server configuration to an application repo is a bad practice. |
| `mail.txt` | Draft or test email body captured during SMTP testing. |
| `test-mail.js` | Script that sends a test email via Nodemailer. Replaced by the `scripts/seed-mail.js` utility. |
| `test-mail.ts` | TypeScript version of `test-mail.js`. Duplicate. |

### 4. HTML Prototypes & Static Mockups

| File | Reason for Removal |
|---|---|
| `live_home.html` | Static HTML prototype of the home page, used before the Next.js implementation. Replaced by `src/app/home/`. |
| `live_home2.html` | Iteration 2 of the same prototype. |
| `live_home3.html` | Iteration 3 of the same prototype. |
| `live_home_utf8.html` | UTF-8 re-encoded version of `live_home.html`. |
| `live_home2_utf8.html` | UTF-8 re-encoded version of `live_home2.html`. |
| `live_home3_utf8.html` | UTF-8 re-encoded version of `live_home3.html`. |

### 5. Process Manager Configuration

| File | Reason for Removal |
|---|---|
| `ecosystem.remote.js` | PM2 ecosystem file targeting a remote host. Docker Compose is the deployment method of record; this file creates ambiguity. |
| `start_production.bat` | Windows Batch file for starting the Next.js production server. The project is deployed on Linux via Docker; this file is unused and misleading. |

### 6. Miscellaneous Temporary Files

| File | Reason for Removal |
|---|---|
| `clean.txt` | Unknown purpose; appears to be a scratch notes file. |
| `check_videos.ts` | Ad-hoc TypeScript script to verify video availability. Superseded by the `scripts/seed-videos.ts` pipeline. |
| `server_translations.ts` | Appears to be an experimental/incomplete translation module placed in the root instead of `src/`. Not imported by any application code. |
| `schema_remote.prisma` | Prisma schema snapshot from a remote database. The authoritative schema is `prisma/schema.prisma`. Two schemas in the root cause confusion with `prisma generate`. |

### 7. Database Dump & Server Configuration

| File | Reason for Removal |
|---|---|
| `blt_db_dump.sql` | Full PostgreSQL dump of the production database. **This is a critical security risk.** Database dumps must never be committed to source control. Store securely in a private backup location (e.g., encrypted S3 bucket, restricted server path). |
| `postgresql.conf` | PostgreSQL server configuration fragment copied from the server. Server configuration does not belong in the application repository. |

---

## Protected Files — Do Not Delete

The following files and directories are critical to the application and must not be touched during cleanup.

### Source Code & Configuration

| Path | Purpose |
|---|---|
| `src/` | All application source code (Next.js App Router, components, API routes, auth, middleware) |
| `prisma/` | Prisma schema and migration history |
| `public/` | Static assets served by Next.js |
| `package.json` | npm manifest and project dependencies |
| `package-lock.json` | Exact dependency lock file |
| `next.config.ts` | Next.js configuration (standalone output, security headers) |
| `tsconfig.json` | TypeScript compiler configuration |
| `postcss.config.mjs` | PostCSS configuration for Tailwind CSS v4 |
| `eslint.config.mjs` | ESLint configuration |
| `docker-compose.yml` | Docker Compose service definitions |

### Documentation

| Path | Purpose |
|---|---|
| `README.md` | Project overview |
| `DEPLOY_README.md` | Deployment instructions (kept for reference — see below) |
| `PROJE_YAPISI.md` | Turkish-language project structure documentation |

---

## Risky Files Kept for Reference

| File | Notes |
|---|---|
| `DEPLOY_README.md` | Contains deployment notes that may still be referenced by the operations team. Review before deleting; migrate useful content into `DOCKER_GUIDE.md`. |
| `scripts/` directory | Contains legitimate utilities (`seed-admin.ts`, `seed-roles.ts`, `reset-admin-password.ts`, `nginx-template.conf`, etc.) that are actively used during deployment and onboarding. Intentionally retained. |
| `linux-deploy/` directory | May contain server setup artifacts. Audit contents before removal. |
| `publish/` directory | May contain build artifacts or deployment bundles. Confirm contents are reproducible before deletion. |

---

## Recommendations

1. **Add a `.gitignore` rule** for common log and output files to prevent re-introduction:
   ```gitignore
   *.log
   *.err
   out*.txt
   clean.txt
   blt_db_dump.sql
   ```

2. **Rotate database credentials.** The `blt_db_dump.sql` file may have exposed database credentials or schema details. Rotate the PostgreSQL password and update `.env` and `docker-compose.yml` accordingly.

3. **Move `schema_remote.prisma`** to a secure location outside the repository if the remote schema still needs to be referenced for comparison.

4. **Store PM2 ecosystem files** (if PM2 is still used alongside Docker) inside a dedicated `infra/` or `deploy/` directory, not the project root.

5. **Audit `scripts/fix_admin.js`** — verify it is still needed or remove it; it appears to be a leftover root-level fix script that was relocated to `scripts/`.

6. **Purge `blt_db_dump.sql` from Git history** using `git filter-repo` or BFG Repo Cleaner if the repository is hosted remotely.
