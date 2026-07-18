'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Chat } from '@/types'
import { store } from '@/lib/store'
import Sidebar from '@/components/Sidebar'
import WelcomeScreen from '@/components/WelcomeScreen'

export default function ChatIndex() {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const loadChats = useCallback(async () => {
    const data = await store.getChats()
    setChats(data)
  }, [])

  useEffect(() => {
    loadChats()
  }, [loadChats])

  const handleNewChat = async () => {
    const chat = await store.createChat('New Chat')
    await loadChats()
    router.push(`/chat/${chat.id}`)
  }

  const handleSelectChat = (id: string) => {
    router.push(`/chat/${id}`)
  }

  const handleDeleteChat = async (id: string) => {
    await store.deleteChat(id)
    await loadChats()
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={null}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 flex items-center justify-center">
        <WelcomeScreen onNewChat={handleNewChat} />
      </main>
    </div>
  )
}
