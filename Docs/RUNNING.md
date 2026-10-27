# Running rules — Zubair portfolio (`web/`)

## Device lock (this machine)

| Field | Value |
|--------|--------|
| Hostname | `techversol-server` |
| Primary NIC | `eno1` |
| MAC address | `88:51:fb:3f:25:03` |
| Port | **`3001`** (always on this device) |
| Local URL | http://localhost:3001 |
| PM2 process name | **`Zubair-portfolio`** |

Verify MAC:

```bash
cat /sys/class/net/eno1/address
```

## PM2 (preferred on this server)

App directory: `/mnt/1TB-EXT/ZubairPortfolio/freelance-portfolio/web`  
Config: `web/ecosystem.config.cjs`

| PM2 name | Role |
|----------|------|
| `Zubair-portfolio` | Next.js production server on port **3001** |
| `Zubair-portfolio-tunnel` | Cloudflare Tunnel (`cloudflared`) — tunnel ID `ae1e0594-014a-4761-aec1-17cfc90139ba` |

### First-time / after dependency or code changes

```bash
cd /mnt/1TB-EXT/ZubairPortfolio/freelance-portfolio/web
npm ci
npm run prepare-assets
npm run build
pm2 start ecosystem.config.cjs
# or restart if already registered:
pm2 restart Zubair-portfolio
pm2 save
```

### Cloudflare Tunnel

Token lives **outside the repo** (do not commit it):

`~/.cloudflared/zubair-portfolio_token`

Starter script: `scripts/start-cloudflare-tunnel.sh`

```bash
pm2 start scripts/start-cloudflare-tunnel.sh --name Zubair-portfolio-tunnel --interpreter bash
pm2 save
pm2 logs Zubair-portfolio-tunnel
```

In Cloudflare Zero Trust, the tunnel’s public hostname must point at **`http://localhost:3001`** (or this machine’s LAN IP + 3001).

> Note: this host already runs a system `cloudflared.service`. Do **not** run `sudo cloudflared service install <token>` for Zubair — that overwrites the shared system tunnel. Use the dedicated PM2 process above instead.

### Daily ops

```bash
pm2 list
pm2 logs Zubair-portfolio
pm2 logs Zubair-portfolio-tunnel
pm2 restart Zubair-portfolio
pm2 restart Zubair-portfolio-tunnel
pm2 stop Zubair-portfolio
```

After reboot, processes come back from `pm2 save` / startup if configured (`pm2 startup`).

## GitHub Actions deploy (`production` branch)

Workflow: `.github/workflows/deploy-production.yml`

On every push to **`production`** (or manual **Run workflow**), GitHub SSHs into this server and runs:

1. `git fetch` + hard reset to `origin/production`
2. `npm ci` in `web/`
3. `npm run prepare-assets` + `npm run build`
4. `pm2 restart Zubair-portfolio`

Deploy script: `scripts/deploy-production.sh`

Repo secrets used: `SSH_HOST`, `SSH_USER`, `SSH_PORT`, `SSH_PRIVATE_KEY`, `DEPLOY_PATH`.

Manual run on the server:

```bash
/mnt/1TB-EXT/ZubairPortfolio/freelance-portfolio/scripts/deploy-production.sh
```

## Manual (without PM2)

```bash
cd /mnt/1TB-EXT/ZubairPortfolio/freelance-portfolio/web
npm run prepare-assets && npm run build
npx next start -p 3001 -H 0.0.0.0
```

Do not change the port on this device. If `3001` is busy, free it before starting:

```bash
ss -tlnp | grep ':3001'
```
