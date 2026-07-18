'use client'

interface WelcomeScreenProps {
  onNewChat: () => void
}

export default function WelcomeScreen({ onNewChat }: WelcomeScreenProps) {
  return (
    <div className="max-w-lg text-center px-6">
      <div className="mb-8">
        <div className="text-4xl font-mono font-bold text-hermes-gold mb-2 tracking-tight">
          HERMES
        </div>
        <div className="text-sm text-hermes-text-dim font-mono">
          Your always-on command center
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8 text-left">
        <FeatureCard
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          }
          title="Chat"
          description="Conversations that persist and remember"
        />
        <FeatureCard
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          }
          title="Skills"
          description="/ commands for instant actions"
        />
        <FeatureCard
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
          title="Memory"
          description="Knowledge that spans all chats"
        />
        <FeatureCard
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          }
          title="MCP"
          description="Connect external tools and services"
        />
      </div>

      <button
        onClick={onNewChat}
        className="px-6 py-2.5 bg-hermes-accent text-white text-sm font-mono font-semibold rounded hover:bg-opacity-90 transition-colors"
      >
        Start a Chat
      </button>

      <div className="mt-6 text-[10px] font-mono text-hermes-text-muted">
        Type <span className="text-hermes-gold">/help</span> in any chat for commands
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-hermes-surface border border-hermes-border rounded-lg p-4">
      <div className="text-hermes-gold mb-2">{icon}</div>
      <div className="text-sm font-mono font-semibold text-hermes-text mb-1">{title}</div>
      <div className="text-xs text-hermes-text-dim">{description}</div>
    </div>
  )
}
