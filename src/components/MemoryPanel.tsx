'use client'

import { useState } from 'react'
import { Memory } from '@/types'

interface MemoryPanelProps {
  memories: Memory[]
  onClose: () => void
  onDelete: (id: string) => void
}

export default function MemoryPanel({ memories, onClose, onDelete }: MemoryPanelProps) {
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = memories.filter(
    (m) =>
      m.key.toLowerCase().includes(search.toLowerCase()) ||
      m.value.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <aside className="w-80 bg-hermes-surface border-l border-hermes-border flex flex-col h-full shrink-0 animate-slide-in">
      <div className="flex items-center justify-between px-4 h-12 border-b border-hermes-border">
        <span className="text-sm font-mono font-semibold text-hermes-gold">Memories</span>
        <button
          onClick={onClose}
          className="text-hermes-text-dim hover:text-hermes-text p-1 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-3 border-b border-hermes-border">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search memories..."
          className="w-full bg-hermes-bg border border-hermes-border rounded px-3 py-1.5 text-sm font-mono text-hermes-text placeholder:text-hermes-text-muted outline-none focus:border-hermes-border-bright"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-hermes-text-muted text-xs font-mono">
              {memories.length === 0 ? 'No memories yet' : 'No matches'}
            </div>
            <div className="text-hermes-text-muted text-[10px] font-mono mt-2">
              Use <span className="text-hermes-gold">/remember</span> to save memories
            </div>
          </div>
        ) : (
          filtered.map((memory) => (
            <div
              key={memory.id}
              className="bg-hermes-bg border border-hermes-border rounded p-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs font-mono font-semibold text-hermes-gold truncate">
                  {memory.key}
                </div>
                <button
                  onClick={() => {
                    if (confirmDelete === memory.id) {
                      onDelete(memory.id)
                      setConfirmDelete(null)
                    } else {
                      setConfirmDelete(memory.id)
                    }
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all ${
                    confirmDelete === memory.id
                      ? 'opacity-100 text-hermes-accent'
                      : 'text-hermes-text-muted hover:text-hermes-accent'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-hermes-text-dim mt-1 break-words">{memory.value}</div>
              {memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono text-hermes-text-muted bg-hermes-elevated px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-[9px] font-mono text-hermes-text-muted mt-2">
                {new Date(memory.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-hermes-border px-4 py-2">
        <div className="text-[10px] font-mono text-hermes-text-muted">
          {memories.length} {memories.length === 1 ? 'memory' : 'memories'} stored
        </div>
      </div>
    </aside>
  )
}
