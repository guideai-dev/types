import type { MessageContent } from '../providers/shared/index.js'
import type { ProviderMetadata } from './core.js'
import type { ProviderSessionTotals } from './provider-totals.js'

// Message types for session parsing

/**
 * Message type classification
 */
export type MessageType =
  | 'user'
  | 'assistant'
  | 'system'
  | 'meta'
  | 'command'
  | 'command_output'
  | 'interruption'
  | 'compact' // Context compaction event
  | 'user_input'
  | 'assistant_response'
  | 'tool_use'
  | 'tool_result'

/**
 * Parsed message - unified message format across providers
 */
export interface ParsedMessage {
  id: string
  timestamp: Date
  type: MessageType
  content: MessageContent
  metadata?: Record<string, unknown>
  providerMetadata?: ProviderMetadata // Provider-specific typed metadata
  parentId?: string
  linkedTo?: string
}

/**
 * Parsed session - complete session with messages
 */
export interface ParsedSession {
  sessionId: string
  provider: string
  messages: ParsedMessage[]
  startTime: Date
  endTime: Date
  duration: number
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Define specific metadata schema
  metadata?: Record<string, any>
  /**
   * Summary record the provider wrote into the transcript (Claude's cost-state, Codex's
   * cumulative token usage). Not a message, so it is attached here rather than parsed
   * into `messages`. Undefined for providers that write none.
   */
  providerTotals?: ProviderSessionTotals
}

/**
 * Legacy UI message types (for backward compatibility)
 */
export interface BaseSessionMessage {
  id: string
  timestamp: string
  type: MessageType
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Create proper content type union for different message types
  content: any
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Define specific metadata schema
  metadata?: Record<string, any>
  parentId?: string
  linkedTo?: string
}

/**
 * Conversation turn - user input paired with assistant response
 */
export interface ConversationTurn {
  id: string
  timestamp: string
  userInput?: {
    content: string
    timestamp: string
  }
  assistantResponse?: {
    content: string
    timestamp: string
    toolUses?: Array<{
      name: string
      // biome-ignore lint/suspicious/noExplicitAny: TODO: Create proper tool input type
      input: any
      // biome-ignore lint/suspicious/noExplicitAny: TODO: Create proper tool result type
      result?: any
    }>
  }
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Define specific metadata schema
  metadata?: Record<string, any>
}

/**
 * Session parser interface - parses raw session files
 */
export interface SessionParser {
  name: string
  parse(content: string, provider: string): BaseSessionMessage[]
  canParse(content: string): boolean
}

/**
 * Provider adapter interface - transforms provider-specific messages
 */
export interface ProviderAdapter {
  name: string
  // biome-ignore lint/suspicious/noExplicitAny: Adapters handle multiple unknown message formats
  transform(rawMessage: any): BaseSessionMessage[]
}

/**
 * Session viewer props - for UI components
 */
export interface SessionViewerProps {
  content: string
  fileName: string
  provider?: string
}

/**
 * Legacy Claude message format (deprecated)
 */
export interface ClaudeMessage {
  uuid: string
  timestamp: string
  type: 'user' | 'assistant'
  message: {
    role: string
    content:
      | string
      // biome-ignore lint/suspicious/noExplicitAny: TODO: Define proper Claude message content blocks
      | Array<{ type: string; text?: string; tool_use_id?: string; content?: any }>
  }
  parentUuid?: string
  isMeta?: boolean
  sessionId: string
  userType?: string
  requestId?: string
}
