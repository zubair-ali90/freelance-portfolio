/**
 * PM2 ecosystem for Zubair portfolio on techversol-server.
 * Device: eno1 MAC 88:51:fb:3f:25:03 — always port 3001.
 *
 * Secrets live in `.env.local` (gitignored). The start script sources them.
 *
 * Usage (from web/):
 *   npm run prepare-assets && npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: "Zubair-portfolio",
      cwd: "/mnt/1TB-EXT/ZubairPortfolio/freelance-portfolio/web",
      script: "scripts/pm2-start.sh",
      interpreter: "bash",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
