import { Skill, SkillContext } from '@/types'

const skills: Skill[] = [
  {
    name: 'help',
    description: 'Show available skills and commands',
    usage: '/help',
    handler: async () => {
      const lines = skills.map((s) => `  **/${s.name}** — ${s.description}`)
      return `## Available Skills\n\n${lines.join('\n')}\n\nType \`/\` to see this list inline.`
    },
  },
  {
    name: 'remember',
    description: 'Save a memory that persists across all chats',
    usage: '/remember <key> = <value>',
    handler: async (args, ctx) => {
      const parts = args.split('=').map((s) => s.trim())
      if (parts.length < 2) return 'Usage: `/remember key = value`'
      const [key, ...rest] = parts
      const value = rest.join('=')
      await ctx.addMemory(key, value, ['user'])
      return `Remembered: **${key}** = ${value}`
    },
  },
  {
    name: 'recall',
    description: 'Search memories from all chats',
    usage: '/recall <search term>',
    handler: async (args, ctx) => {
      if (!args.trim()) {
        if (ctx.memories.length === 0) return 'No memories stored yet. Use `/remember` to save one.'
        const lines = ctx.memories.slice(0, 20).map((m) => `- **${m.key}**: ${m.value}`)
        return `## Memories (${ctx.memories.length})\n\n${lines.join('\n')}`
      }
      const q = args.trim().toLowerCase()
      const matches = ctx.memories.filter(
        (m) =>
          m.key.toLowerCase().includes(q) ||
          m.value.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      )
      if (matches.length === 0) return `No memories matching "${args.trim()}".`
      const lines = matches.map((m) => `- **${m.key}**: ${m.value}`)
      return `## Memories matching "${args.trim()}"\n\n${lines.join('\n')}`
    },
  },
  {
    name: 'forget',
    description: 'Delete a memory by key',
    usage: '/forget <key>',
    handler: async (args, ctx) => {
      const key = args.trim()
      const match = ctx.memories.find((m) => m.key.toLowerCase() === key.toLowerCase())
      if (!match) return `No memory with key "${key}" found.`
      return `Forgot: **${key}**\n\n_Memory deleted._`
    },
  },
  {
    name: 'clear',
    description: 'Clear the current chat display',
    usage: '/clear',
    handler: async () => {
      return '__CLEAR__'
    },
  },
  {
    name: 'export',
    description: 'Export this chat as markdown',
    usage: '/export',
    handler: async () => {
      return '__EXPORT__'
    },
  },
  {
    name: 'status',
    description: 'Show Hermes system status',
    usage: '/status',
    handler: async (_args, ctx) => {
      const memCount = ctx.memories.length
      return [
        '## Hermes Status',
        '',
        `- **Memories**: ${memCount} stored`,
        `- **Chat**: ${ctx.chatId}`,
        `- **Storage**: ${typeof window !== 'undefined' && localStorage.getItem('hermes:chats') ? 'Local' : 'Supabase'}`,
        `- **Status**: Online`,
        `- **Version**: 0.1.0`,
      ].join('\n')
    },
  },
  {
    name: 'mcp',
    description: 'Manage MCP server connections',
    usage: '/mcp [list|add|remove]',
    handler: async (args) => {
      const sub = args.trim().split(' ')[0] || 'list'
      if (sub === 'list') {
        return '## MCP Servers\n\nNo MCP servers configured yet.\n\nUse `/mcp add <name> <url>` to add one.'
      }
      if (sub === 'add') {
        return 'MCP server registration coming soon. For now, configure in `.hermes/mcp.json`.'
      }
      return `Unknown subcommand: ${sub}. Use \`list\`, \`add\`, or \`remove\`.`
    },
  },
  {
    name: 'config',
    description: 'View or update Hermes configuration',
    usage: '/config [key] [value]',
    handler: async (args) => {
      if (!args.trim()) {
        return [
          '## Hermes Config',
          '',
          '| Key | Value |',
          '|-----|-------|',
          '| theme | dark |',
          '| font_size | 14px |',
          '| model | claude-sonnet-5 |',
          '| auto_title | true |',
          '',
          'Use `/config <key> <value>` to update.',
        ].join('\n')
      }
      return 'Config updates will be saved to your preferences.'
    },
  },
]

export function getSkills(): Skill[] {
  return skills
}

export function findSkill(name: string): Skill | undefined {
  return skills.find((s) => s.name === name.toLowerCase())
}

export function parseSkillCommand(input: string): { skill: string; args: string } | null {
  if (!input.startsWith('/')) return null
  const trimmed = input.slice(1).trim()
  const spaceIdx = trimmed.indexOf(' ')
  if (spaceIdx === -1) return { skill: trimmed, args: '' }
  return { skill: trimmed.slice(0, spaceIdx), args: trimmed.slice(spaceIdx + 1) }
}
