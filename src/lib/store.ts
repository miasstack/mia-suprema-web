import { Chat, Message, Memory } from '@/types'
import { getSupabase, isSupabaseConfigured } from './supabase'
import { v4 as uuid } from 'uuid'

let _useLocal: boolean | null = null
function useLocal() {
  if (_useLocal === null) _useLocal = !isSupabaseConfigured()
  return _useLocal
}

function getLocal<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(`hermes:${key}`)
  return data ? JSON.parse(data) : []
}

function setLocal<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`hermes:${key}`, JSON.stringify(data))
}

export const store = {
  async getChats(): Promise<Chat[]> {
    if (useLocal()) {
      return getLocal<Chat>('chats').sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    }
    const { data } = await getSupabase()
      .from('chats')
      .select('*')
      .order('updated_at', { ascending: false })
    return data || []
  },

  async createChat(title: string): Promise<Chat> {
    const chat: Chat = {
      id: uuid(),
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pinned: false,
    }
    if (useLocal()) {
      const chats = getLocal<Chat>('chats')
      chats.push(chat)
      setLocal('chats', chats)
      return chat
    }
    const { data } = await getSupabase().from('chats').insert(chat).select().single()
    return data || chat
  },

  async updateChat(id: string, updates: Partial<Chat>): Promise<void> {
    if (useLocal()) {
      const chats = getLocal<Chat>('chats')
      const idx = chats.findIndex((c) => c.id === id)
      if (idx >= 0) {
        chats[idx] = { ...chats[idx], ...updates, updated_at: new Date().toISOString() }
        setLocal('chats', chats)
      }
      return
    }
    await getSupabase().from('chats').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
  },

  async deleteChat(id: string): Promise<void> {
    if (useLocal()) {
      setLocal('chats', getLocal<Chat>('chats').filter((c) => c.id !== id))
      setLocal('messages', getLocal<Message>('messages').filter((m) => m.chat_id !== id))
      return
    }
    await getSupabase().from('messages').delete().eq('chat_id', id)
    await getSupabase().from('chats').delete().eq('id', id)
  },

  async getMessages(chatId: string): Promise<Message[]> {
    if (useLocal()) {
      return getLocal<Message>('messages')
        .filter((m) => m.chat_id === chatId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }
    const { data } = await getSupabase()
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
    return data || []
  },

  async addMessage(msg: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const message: Message = {
      ...msg,
      id: uuid(),
      created_at: new Date().toISOString(),
    }
    if (useLocal()) {
      const messages = getLocal<Message>('messages')
      messages.push(message)
      setLocal('messages', messages)
      await this.updateChat(msg.chat_id, {})
      return message
    }
    const { data } = await getSupabase().from('messages').insert(message).select().single()
    await this.updateChat(msg.chat_id, {})
    return data || message
  },

  async getMemories(): Promise<Memory[]> {
    if (useLocal()) {
      return getLocal<Memory>('memories').sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    }
    const { data } = await getSupabase()
      .from('memories')
      .select('*')
      .order('updated_at', { ascending: false })
    return data || []
  },

  async addMemory(key: string, value: string, sourceChatId: string, tags: string[] = []): Promise<Memory> {
    const memory: Memory = {
      id: uuid(),
      key,
      value,
      source_chat_id: sourceChatId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags,
    }
    if (useLocal()) {
      const memories = getLocal<Memory>('memories')
      const existing = memories.findIndex((m) => m.key === key)
      if (existing >= 0) {
        memories[existing] = { ...memories[existing], value, updated_at: new Date().toISOString(), tags }
      } else {
        memories.push(memory)
      }
      setLocal('memories', memories)
      return memory
    }
    const { data } = await getSupabase().from('memories').upsert(memory, { onConflict: 'key' }).select().single()
    return data || memory
  },

  async deleteMemory(id: string): Promise<void> {
    if (useLocal()) {
      setLocal('memories', getLocal<Memory>('memories').filter((m) => m.id !== id))
      return
    }
    await getSupabase().from('memories').delete().eq('id', id)
  },

  async searchMemories(query: string): Promise<Memory[]> {
    const memories = await this.getMemories()
    const q = query.toLowerCase()
    return memories.filter(
      (m) =>
        m.key.toLowerCase().includes(q) ||
        m.value.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    )
  },
}
