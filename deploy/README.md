# Deploy Hermes on the VPS (self-hosted, private)

Runs the Hermes web app **inside the VPS**, next to the existing FreeLLMAPI
container. After this, everything lives on your machine:

```
you / Claude / Codex ──HTTPS + password──► Caddy (443) ► Hermes web (127.0.0.1:8090)
                                                            │
                                                            ▼
                                            FreeLLMAPI (127.0.0.1:3000, no longer public)
```

## Install (run on the VPS)

```bash
# 1. Get the code
sudo mkdir -p /opt/hermes-web && sudo chown $USER /opt/hermes-web
git clone -b claude/hermes-tool-redesign-gxrtim https://github.com/miasstack/mia-suprema-web /opt/hermes-web
cd /opt/hermes-web/deploy

# 2. Secrets (agnes key + a login password you choose)
cat > .env <<'EOF'
HERMES_LLM_API_KEY=PASTE_AGNES_KEY_HERE
HERMES_WEB_PASSWORD=CHOOSE_A_STRONG_PASSWORD
EOF
chmod 600 .env

# 3. Build and start (first build takes a few minutes on a small VPS)
sudo docker compose -f docker-compose.vps.yml up -d --build

# 4. Check
curl -sk https://localhost/api/chat   # expect {"error":"unauthorized"} — auth works
```

## Lock FreeLLMAPI down (recommended)

Port 3000 is currently open to the whole internet. Bind it to localhost:

```bash
cd /opt/hermes-vps
# edit docker-compose.yml: change  "3000:3001"  to  "127.0.0.1:3000:3001"
sudo docker compose up -d
```

Then in the cloud firewall (GCP/Oracle console): **allow 443**, **remove the
rule for 3000**. To reach the FreeLLMAPI dashboard afterwards, tunnel:
`ssh -L 3000:localhost:3000 user@VPS_IP` and open http://localhost:3000.

## Use it

- Browser: `https://VPS_IP` → password → chat. (Self-signed cert warning the
  first time — expected without a domain; add a domain to the Caddyfile for a
  clean padlock.)
- Agents (Claude, ChatGPT/Codex, scripts) hit the API with the password as a
  bearer token:

```bash
curl -sk https://VPS_IP/api/chat \
  -H "Authorization: Bearer YOUR_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hello"}]}'
```

## Update to a newer version

```bash
cd /opt/hermes-web && git pull
cd deploy && sudo docker compose -f docker-compose.vps.yml up -d --build
```
