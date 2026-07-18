# Hermes — Claude Code-style command center

Next.js app: multiple chats, `/` skills, cross-chat persistent memory, and a real
LLM backend powered by your **FreeLLMAPI** rotation engine (free-tier keys for
Google, Groq, OpenRouter, …) running 24/7 on the Google Cloud VPS.

The original static artist site is preserved untouched in `genesis-archive/`.

## Architecture

```
Browser (Vercel: /chat)
   │  POST /api/chat  (streaming)
   ▼
Next.js API route  ── injects agnes key, max_tokens 8192 ──►  FreeLLMAPI VPS
                                                              http://146.148.98.134:3000/v1
                                                              (rotates free provider keys)
```

The key never reaches the browser, and the HTTPS page never talks to the
HTTP VPS directly (no mixed-content problems).

## One-time setup (required before chat works)

1. Open the FreeLLMAPI dashboard: `http://146.148.98.134:3000` → **Keys**.
2. Copy the unified API key for the **agnes** account (starts with `freellmapi-`).
3. In Vercel → project → **Settings → Environment Variables**, add:

   | Name | Value |
   |------|-------|
   | `HERMES_LLM_API_KEY` | the agnes unified key |
   | `HERMES_LLM_BASE_URL` | `http://146.148.98.134:3000/v1` (default, optional) |
   | `HERMES_LLM_MODEL` | `auto` (default, optional) |

4. Redeploy. Run `/status` in any chat to confirm the backend is online.

For local dev, put the same variables in `.env.local` and run `npm run dev`.

## Features

- **Chats** — unlimited conversations, auto-titled, stored in localStorage
  (Supabase optional, see `.env.example` for the schema).
- **Skills** — slash commands: `/help`, `/remember`, `/recall`, `/forget`,
  `/status`, `/config`, `/export`, `/clear`, `/mcp`.
- **Memory across chats** — everything saved with `/remember` (or saved
  automatically by the model via `<memory>` tags) is injected into every
  conversation's system prompt, whatever chat it came from.
- **Always online** — Vercel serves the app; the FreeLLMAPI VPS runs 24/7
  under Docker (`restart: unless-stopped`).

## Related

- `miasstack/hermes-vps-setup` — VPS provisioning for FreeLLMAPI + the Nous
  Hermes agent (Telegram, terminal, cron). This web app is a separate frontend
  that shares the same FreeLLMAPI token pool.
- `genesis-archive/` — the original "La Noche de Oro" static site, kept as-is.
