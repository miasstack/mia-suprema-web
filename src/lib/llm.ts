import { Memory, Message } from '@/types'

export interface StreamCallbacks {
  onToken: (fullText: string) => void
}

export interface LLMResult {
  content: string
  memories: { key: string; value: string }[]
  error?: string
}

const MEMORY_TAG = /<memory\s+key="([^"]+)">([\s\S]*?)<\/memory>/g

export function extractMemories(text: string): { content: string; memories: { key: string; value: string }[] } {
  const memories: { key: string; value: string }[] = []
  const content = text
    .replace(MEMORY_TAG, (_all, key: string, value: string) => {
      memories.push({ key: key.trim(), value: value.trim() })
      return ''
    })
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return { content, memories }
}

export async function streamChat(
  history: Message[],
  memories: Memory[],
  callbacks: StreamCallbacks,
  opts: { skill?: { name: string; instructions: string }; model?: string } = {}
): Promise<LLMResult> {
  let res: Response
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history.map((m) => ({ role: m.role, content: m.content })),
        memories: memories.map((m) => ({ key: m.key, value: m.value })),
        skill: opts.skill,
        model: opts.model,
      }),
    })
  } catch (err) {
    return {
      content: '',
      memories: [],
      error: `Network error reaching Hermes backend: ${err instanceof Error ? err.message : String(err)}`,
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    return {
      content: '',
      memories: [],
      error: data?.message || `Backend error (${res.status})`,
    }
  }

  if (!res.body) {
    return { content: '', memories: [], error: 'Empty response from backend' }
  }

  // Parse the OpenAI-compatible SSE stream.
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let text = ''

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        if (payload === '[DONE]') continue
        try {
          const json = JSON.parse(payload)
          const delta: string | undefined = json.choices?.[0]?.delta?.content
          if (delta) {
            text += delta
            // Hide any partial/complete memory tags while streaming.
            callbacks.onToken(text.replace(MEMORY_TAG, '').replace(/<memory[^>]*>[\s\S]*$/, ''))
          }
        } catch {
          // Ignore malformed keep-alive lines.
        }
      }
    }
  } catch (err) {
    if (!text) {
      return {
        content: '',
        memories: [],
        error: `Stream interrupted: ${err instanceof Error ? err.message : String(err)}`,
      }
    }
  }

  const { content, memories: extracted } = extractMemories(text)
  return { content, memories: extracted }
}

export interface BackendStatus {
  configured: boolean
  online?: boolean
  base_url: string
  model: string
  models?: string[]
}

export async function getBackendStatus(): Promise<BackendStatus | null> {
  try {
    const res = await fetch('/api/chat')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
