'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Chat, Message, Memory } from '@/types'
import { store } from '@/lib/store'
import { findSkill, parseSkillCommand, getSkills } from '@/lib/skills'
import Sidebar from '@/components/Sidebar'
import MessageView from '@/components/MessageView'
import CommandInput from '@/components/CommandInput'
import MemoryPanel from '@/components/MemoryPanel'

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const chatId = params.id as string

  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadData = useCallback(async () => {
    const [chatList, msgs, mems] = await Promise.all([
      store.getChats(),
      store.getMessages(chatId),
      store.getMemories(),
    ])
    setChats(chatList)
    setMessages(msgs)
    setMemories(mems)
  }, [chatId])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNewChat = async () => {
    const chat = await store.createChat('New Chat')
    router.push(`/chat/${chat.id}`)
  }

  const handleSelectChat = (id: string) => {
    router.push(`/chat/${id}`)
  }

  const handleDeleteChat = async (id: string) => {
    await store.deleteChat(id)
    if (id === chatId) {
      router.push('/chat')
    } else {
      const chatList = await store.getChats()
      setChats(chatList)
    }
  }

  const handleSubmit = async (input: string) => {
    if (!input.trim() || isProcessing) return

    const userMsg = await store.addMessage({
      chat_id: chatId,
      role: 'user',
      content: input,
    })
    setMessages((prev) => [...prev, userMsg])

    if (messages.length === 0) {
      const title = input.length > 50 ? input.slice(0, 50) + '...' : input
      await store.updateChat(chatId, { title })
      const chatList = await store.getChats()
      setChats(chatList)
    }

    const parsed = parseSkillCommand(input)
    if (parsed) {
      setIsProcessing(true)
      const skill = findSkill(parsed.skill)
      if (skill) {
        const ctx = {
          chatId,
          memories,
          addMemory: async (key: string, value: string, tags: string[] = []) => {
            await store.addMemory(key, value, chatId, tags)
            const mems = await store.getMemories()
            setMemories(mems)
          },
        }
        const result = await skill.handler(parsed.args, ctx)

        if (result === '__CLEAR__') {
          setMessages([])
          setIsProcessing(false)
          return
        }

        if (result === '__EXPORT__') {
          const md = messages
            .map((m) => `**${m.role === 'user' ? 'You' : 'Hermes'}**: ${m.content}`)
            .join('\n\n---\n\n')
          const blob = new Blob([md], { type: 'text/markdown' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `hermes-chat-${chatId.slice(0, 8)}.md`
          a.click()
          URL.revokeObjectURL(url)

          const exportMsg = await store.addMessage({
            chat_id: chatId,
            role: 'assistant',
            content: 'Chat exported as markdown.',
            skill_used: 'export',
          })
          setMessages((prev) => [...prev, exportMsg])
          setIsProcessing(false)
          return
        }

        const assistantMsg = await store.addMessage({
          chat_id: chatId,
          role: 'assistant',
          content: result,
          skill_used: parsed.skill,
        })
        setMessages((prev) => [...prev, assistantMsg])
      } else {
        const errorMsg = await store.addMessage({
          chat_id: chatId,
          role: 'assistant',
          content: `Unknown skill: \`/${parsed.skill}\`. Type \`/help\` to see available skills.`,
        })
        setMessages((prev) => [...prev, errorMsg])
      }
      setIsProcessing(false)
      return
    }

    setIsProcessing(true)
    const response = generateResponse(input, memories)
    const assistantMsg = await store.addMessage({
      chat_id: chatId,
      role: 'assistant',
      content: response,
    })
    setMessages((prev) => [...prev, assistantMsg])
    setIsProcessing(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={chatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 h-12 border-b border-hermes-border shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-hermes-text-dim hover:text-hermes-text p-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>
            )}
            <span className="text-sm font-mono text-hermes-text-dim truncate">
              {chats.find((c) => c.id === chatId)?.title || 'Chat'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMemoryPanelOpen(!memoryPanelOpen)}
              className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
                memoryPanelOpen
                  ? 'border-hermes-gold text-hermes-gold bg-hermes-gold-dim'
                  : 'border-hermes-border text-hermes-text-dim hover:text-hermes-text hover:border-hermes-border-bright'
              }`}
            >
              Memory {memories.length > 0 && `(${memories.length})`}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-3xl mx-auto space-y-1">
                {messages.map((msg) => (
                  <MessageView key={msg.id} message={msg} />
                ))}
                {isProcessing && (
                  <div className="flex gap-3 py-3 animate-fade-in">
                    <div className="w-6 h-6 rounded bg-hermes-accent flex items-center justify-center text-xs font-mono font-bold text-white shrink-0 mt-0.5">
                      H
                    </div>
                    <div className="text-sm text-hermes-text-dim typing-cursor">Thinking</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-hermes-border p-4 shrink-0">
              <div className="max-w-3xl mx-auto">
                <CommandInput
                  onSubmit={handleSubmit}
                  disabled={isProcessing}
                  skills={getSkills()}
                />
              </div>
            </div>
          </div>

          {memoryPanelOpen && (
            <MemoryPanel
              memories={memories}
              onClose={() => setMemoryPanelOpen(false)}
              onDelete={async (id) => {
                await store.deleteMemory(id)
                const mems = await store.getMemories()
                setMemories(mems)
              }}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function generateResponse(input: string, memories: Memory[]): string {
  const lower = input.toLowerCase()

  const relevantMemories = memories.filter(
    (m) =>
      lower.includes(m.key.toLowerCase()) ||
      m.tags.some((t) => lower.includes(t.toLowerCase()))
  )

  if (relevantMemories.length > 0) {
    const memContext = relevantMemories
      .map((m) => `- **${m.key}**: ${m.value}`)
      .join('\n')
    return `Based on what I remember:\n\n${memContext}\n\nHow would you like me to help with this?`
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hey. What are we working on?'
  }

  if (lower.includes('who are you') || lower.includes('what are you')) {
    return `I'm **Hermes** — your always-on command center. I can:\n\n- Run skills with \`/\` commands\n- Remember things across chats with \`/remember\`\n- Recall context from any conversation with \`/recall\`\n- Connect to external tools via MCP\n\nType \`/help\` to see all available skills.`
  }

  return `Got it. I've noted that.\n\nRight now I'm running in **local mode** — I process skill commands (\`/help\`, \`/remember\`, \`/recall\`, etc.) and store memories across your chats.\n\nTo connect me to an AI backend for full conversations, add your API keys in \`/config\`. Type \`/help\` to see what I can do.`
}
