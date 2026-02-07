// Metric Calculation Helper Utilities
// Type-safe helper functions for extracting and analysing content from sessions

import type { TextContent, ToolResultContent, ToolUseContent } from '../providers/shared/index.js'
import {
  isTextContent,
  isThinkingContent,
  isToolResultContent,
  isToolUseContent,
} from '../providers/shared/index.js'
import type { ParsedMessage } from '../sessions/messages.js'

/**
 * Extract all tool uses from session messages
 */
export function extractToolUses(messages: ParsedMessage[]): ToolUseContent[] {
  const toolUses: ToolUseContent[] = []

  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      for (const block of msg.content) {
        if (isToolUseContent(block)) {
          toolUses.push(block)
        }
      }
    }
  }

  return toolUses
}

/**
 * Extract all tool results from session messages
 */
export function extractToolResults(messages: ParsedMessage[]): ToolResultContent[] {
  const results: ToolResultContent[] = []

  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      for (const block of msg.content) {
        if (isToolResultContent(block)) {
          results.push(block)
        }
      }
    }
  }

  return results
}

/**
 * Extract text content from a message
 */
export function extractTextFromMessage(message: ParsedMessage): string {
  if (typeof message.content === 'string') {
    return message.content
  }

  if (Array.isArray(message.content)) {
    return message.content
      .filter(isTextContent)
      .map((block: TextContent) => block.text)
      .join('\n')
  }

  // StructuredMessageContent
  const structured = message.content
  // Structured content will have text field set if it's a text message
  return structured.text || ''
}

/**
 * Count tool uses by name
 */
export function countToolUsesByName(toolUses: ToolUseContent[]): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const tool of toolUses) {
    counts[tool.name] = (counts[tool.name] || 0) + 1
  }

  return counts
}

/**
 * Type guard: Check if tool result indicates an error
 */
export function isErrorResult(result: ToolResultContent): boolean {
  // Explicit error flag
  if (result.is_error) return true

  // Check content for error indicators
  const contentStr =
    typeof result.content === 'string' ? result.content : JSON.stringify(result.content)

  const errorKeywords = [
    'error',
    'failed',
    'exception',
    'cannot',
    'unable',
    'not found',
    'permission denied',
    'syntax error',
    'type error',
  ]

  const lowerContent = contentStr.toLowerCase()
  return errorKeywords.some(keyword => lowerContent.includes(keyword))
}

/**
 * Filter tool results by error status
 */
export function filterErrorResults(results: ToolResultContent[]): ToolResultContent[] {
  return results.filter(isErrorResult)
}

/**
 * Filter tool results by success status
 */
export function filterSuccessResults(results: ToolResultContent[]): ToolResultContent[] {
  return results.filter(result => !isErrorResult(result))
}

/**
 * Pair tool uses with their results
 */
export function pairToolUsesWithResults(
  toolUses: ToolUseContent[],
  toolResults: ToolResultContent[]
): Array<{ toolUse: ToolUseContent; result?: ToolResultContent }> {
  const resultsByToolId = new Map<string, ToolResultContent>()

  // Index results by tool_use_id
  for (const result of toolResults) {
    resultsByToolId.set(result.tool_use_id, result)
  }

  // Pair each tool use with its result
  return toolUses.map(toolUse => ({
    toolUse,
    result: resultsByToolId.get(toolUse.id),
  }))
}

/**
 * Get messages by type
 */
export function filterMessagesByType(
  messages: ParsedMessage[],
  type: ParsedMessage['type']
): ParsedMessage[] {
  return messages.filter(msg => msg.type === type)
}

/**
 * Get user messages
 */
export function getUserMessages(messages: ParsedMessage[]): ParsedMessage[] {
  return filterMessagesByType(messages, 'user')
}

/**
 * Get assistant messages
 */
export function getAssistantMessages(messages: ParsedMessage[]): ParsedMessage[] {
  return filterMessagesByType(messages, 'assistant')
}

/**
 * Count messages by type
 */
export function countMessagesByType(messages: ParsedMessage[]): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const msg of messages) {
    counts[msg.type] = (counts[msg.type] || 0) + 1
  }

  return counts
}

/**
 * Calculate message length statistics
 */
export function calculateMessageLengthStats(messages: ParsedMessage[]): {
  min: number
  max: number
  avg: number
  total: number
} {
  if (messages.length === 0) {
    return { min: 0, max: 0, avg: 0, total: 0 }
  }

  const lengths = messages.map(msg => {
    const text = extractTextFromMessage(msg)
    return text.length
  })

  return {
    min: Math.min(...lengths),
    max: Math.max(...lengths),
    avg: lengths.reduce((sum, len) => sum + len, 0) / lengths.length,
    total: lengths.reduce((sum, len) => sum + len, 0),
  }
}

/**
 * Check if message contains tool uses
 */
export function messageHasToolUses(message: ParsedMessage): boolean {
  if (typeof message.content === 'string') return false
  if (Array.isArray(message.content)) {
    return message.content.some(isToolUseContent)
  }
  // StructuredMessageContent - check toolUse field
  return message.content.toolUse !== undefined
}

/**
 * Check if message contains tool results
 */
export function messageHasToolResults(message: ParsedMessage): boolean {
  if (typeof message.content === 'string') return false
  if (Array.isArray(message.content)) {
    return message.content.some(isToolResultContent)
  }
  // StructuredMessageContent - check toolResult field
  return message.content.toolResult !== undefined
}

/**
 * Check if message contains thinking
 */
export function messageHasThinking(message: ParsedMessage): boolean {
  if (typeof message.content === 'string') return false
  if (Array.isArray(message.content)) {
    return message.content.some(isThinkingContent)
  }
  // StructuredMessageContent - thinking would not be in our simplified structure
  // (text/toolUse/toolResult only)
  return false
}
