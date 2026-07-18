import { NextRequest } from 'next/server'

// Proxies chat completions to the FreeLLMAPI rotation engine on the Hermes VPS.
// The key ("agnes" unified key from the FreeLLMAPI dashboard) stays server-side.
const BASE_URL = (process.env.HERMES_LLM_BASE_URL || 'http://146.148.98.134:3000/v1').replace(/\/$/, '')
const API_KEY = process.env.HERMES_LLM_API_KEY || ''
const MODEL = process.env.HERMES_LLM_MODEL || 'auto'

// Free-tier providers reject the huge default max_tokens — keep at 8192.
const MAX_TOKENS = 8192

export const dynamic = 'force-dynamic'
export const maxDuration = 300

interface ChatBody {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
  memories?: { key: string; value: string }[]
  skill?: { name: string; instructions: string }
  model?: string
}

function buildSystemPrompt(memories: ChatBody['memories'], skill: ChatBody['skill']): string {
  const parts = [
    `You are Hermes — an always-on personal agent with a Claude Code-style interface. You live at the user's command center and help with anything: coding, research, planning, writing, business.`,
    `Be direct and useful. Format responses in markdown. Keep answers tight unless depth is asked for.`,
    `## Persistent memory`,
    `You have a memory store shared across ALL of the user's chats. When the user tells you something worth remembering (preferences, facts about their projects, decisions), save it by including a tag in your reply exactly like this:`,
    `<memory key="short-key">the fact to remember</memory>`,
    `The tag is stripped before display, so also mention naturally that you've noted it. Only save durable facts, not chit-chat.`,
  ]
  if (memories && memories.length > 0) {
    parts.push(
      `## Current memories (from all chats)`,
      memories.map((m) => `- ${m.key}: ${m.value}`).join('\n')
    )
  }
  if (skill) {
    parts.push(`## Active skill: ${skill.name}`, skill.instructions)
  }
  return parts.join('\n\n')
}

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return Response.json(
      {
        error: 'not_configured',
        message:
          'Hermes LLM backend is not configured. Set HERMES_LLM_API_KEY (the agnes unified key from the FreeLLMAPI dashboard) in your Vercel project environment variables, then redeploy.',
      },
      { status: 503 }
    )
  }

  let body: ChatBody
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'bad_request', message: 'Invalid JSON body' }, { status: 400 })
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: 'bad_request', message: 'messages[] required' }, { status: 400 })
  }

  const messages = [
    { role: 'system', content: buildSystemPrompt(body.memories, body.skill) },
    // Cap history to keep free-tier context happy.
    ...body.messages.slice(-40).map((m) => ({ role: m.role, content: m.content })),
  ]

  let upstream: globalThis.Response
  try {
    upstream = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: body.model || MODEL,
        messages,
        max_tokens: MAX_TOKENS,
        stream: true,
      }),
    })
  } catch (err) {
    return Response.json(
      {
        error: 'upstream_unreachable',
        message: `Could not reach the FreeLLMAPI server at ${BASE_URL}. Check that the VPS (Docker container) is running.`,
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    )
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '')
    return Response.json(
      {
        error: 'upstream_error',
        message: `FreeLLMAPI returned ${upstream.status}. ${text.slice(0, 500)}`,
      },
      { status: 502 }
    )
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
    },
  })
}

// GET /api/chat — connectivity + model info for /status.
export async function GET() {
  if (!API_KEY) {
    return Response.json({ configured: false, base_url: BASE_URL, model: MODEL })
  }
  try {
    const res = await fetch(`${BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: AbortSignal.timeout(10_000),
    })
    const data = res.ok ? await res.json().catch(() => null) : null
    const models: string[] = Array.isArray(data?.data)
      ? data.data.map((m: { id: string }) => m.id).slice(0, 50)
      : []
    return Response.json({
      configured: true,
      online: res.ok,
      base_url: BASE_URL,
      model: MODEL,
      models,
    })
  } catch {
    return Response.json({ configured: true, online: false, base_url: BASE_URL, model: MODEL })
  }
}
