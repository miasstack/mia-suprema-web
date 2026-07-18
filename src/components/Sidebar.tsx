'use client'

import { useState } from 'react'
import { Chat } from '@/types'

interface SidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (!isOpen) return null

  const today = new Date()
  const todayStr = today.toDateString()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const groups: { label: string; chats: Chat[] }[] = []
  const todayChats = chats.filter((c) => new Date(c.updated_at).toDateString() === todayStr)
  const weekChats = chats.filter(
    (c) => new Date(c.updated_at).toDateString() !== todayStr && new Date(c.updated_at) > weekAgo
  )
  const olderChats = chats.filter((c) => new Date(c.updated_at) <= weekAgo)

  if (todayChats.length) groups.push({ label: 'Today', chats: todayChats })
  if (weekChats.length) groups.push({ label: 'This Week', chats: weekChats })
  if (olderChats.length) groups.push({ label: 'Older', chats: olderChats })

  return (
    <aside className="w-64 bg-hermes-surface border-r border-hermes-border flex flex-col h-full shrink-0">
      <div className="flex items-center justify-between px-3 h-12 border-b border-hermes-border">
        <div className="flex items-center gap-2">
          <span className="text-hermes-gold font-mono font-bold text-sm">HERMES</span>
          <span className="text-[10px] text-hermes-text-muted font-mono">v0.1</span>
        </div>
        <button
          onClick={onToggle}
          className="text-hermes-text-dim hover:text-hermes-text p-1 transition-colors"
          title="Close sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="p-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-mono text-hermes-text-dim hover:text-hermes-text hover:bg-hermes-elevated rounded transition-colors border border-hermes-border hover:border-hermes-border-bright"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="px-3 py-1 text-[10px] font-mono text-hermes-text-muted uppercase tracking-widest">
              {group.label}
            </div>
            {group.chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center rounded px-3 py-1.5 cursor-pointer transition-colors ${
                  chat.id === activeChatId
                    ? 'bg-hermes-elevated text-hermes-text'
                    : 'text-hermes-text-dim hover:text-hermes-text hover:bg-hermes-elevated/50'
                }`}
                onClick={() => onSelectChat(chat.id)}
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => {
                  setHoveredChat(null)
                  setConfirmDelete(null)
                }}
              >
                <span className="text-sm truncate flex-1 font-mono">{chat.title}</span>
                {hoveredChat === chat.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirmDelete === chat.id) {
                        onDeleteChat(chat.id)
                        setConfirmDelete(null)
                      } else {
                        setConfirmDelete(chat.id)
                      }
                    }}
                    className={`ml-1 p-0.5 rounded transition-colors ${
                      confirmDelete === chat.id
                        ? 'text-hermes-accent'
                        : 'text-hermes-text-muted hover:text-hermes-accent'
                    }`}
                    title={confirmDelete === chat.id ? 'Click again to delete' : 'Delete chat'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}

        {chats.length === 0 && (
          <div className="px-3 py-8 text-center">
            <div className="text-hermes-text-muted text-xs font-mono">No chats yet</div>
            <div className="text-hermes-text-muted text-xs font-mono mt-1">Start a new one above</div>
          </div>
        )}
      </nav>

      <div className="border-t border-hermes-border p-2">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-hermes-text-muted">
          <div className="w-2 h-2 rounded-full bg-hermes-success animate-pulse" />
          Online
        </div>
      </div>
    </aside>
  )
}
