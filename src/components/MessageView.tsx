'use client'

import { Message } from '@/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageViewProps {
  message: Message
}

export default function MessageView({ message }: MessageViewProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center py-2 animate-fade-in">
        <span className="text-xs font-mono text-hermes-text-muted bg-hermes-surface px-3 py-1 rounded-full border border-hermes-border">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className="flex gap-3 py-3 animate-fade-in">
      <div
        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
          isUser
            ? 'bg-hermes-border-bright text-hermes-text'
            : 'bg-hermes-accent text-white'
        }`}
      >
        {isUser ? 'Y' : 'H'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-semibold text-hermes-text-dim">
            {isUser ? 'You' : 'Hermes'}
          </span>
          {message.skill_used && (
            <span className="text-[10px] font-mono text-hermes-gold bg-hermes-gold-dim px-1.5 py-0.5 rounded">
              /{message.skill_used}
            </span>
          )}
          <span className="text-[10px] font-mono text-hermes-text-muted">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="message-content text-sm leading-relaxed">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}
