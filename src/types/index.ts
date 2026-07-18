export interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
  pinned: boolean
}

export interface Message {
  id: string
  chat_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
  skill_used?: string
  metadata?: Record<string, unknown>
}

export interface Memory {
  id: string
  key: string
  value: string
  source_chat_id: string
  created_at: string
  updated_at: string
  tags: string[]
}

export interface Skill {
  name: string
  description: string
  usage: string
  // Present on prompt skills: instructions injected into the model's system
  // prompt when invoked, instead of running a local handler.
  instructions?: string
  handler: (args: string, context: SkillContext) => Promise<string>
}

export interface CustomSkill {
  name: string
  description: string
  instructions: string
  created_at: string
}

export interface SkillContext {
  chatId: string
  memories: Memory[]
  addMemory: (key: string, value: string, tags?: string[]) => Promise<void>
  removeMemory: (id: string) => Promise<void>
}

export interface MCPServer {
  id: string
  name: string
  url: string
  status: 'connected' | 'disconnected' | 'error'
  tools: MCPTool[]
}

export interface MCPTool {
  name: string
  description: string
  parameters: Record<string, unknown>
}

export interface HermesConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  mcpServers: MCPServer[]
}
