// Re-export all types from organised sub-modules

// Domain types
export * from './domain/users.js'
export * from './domain/tenants.js'
export * from './domain/api-keys.js'

// Session types
export * from './sessions/core.js'
export * from './sessions/messages.js'
export * from './sessions/responses.js'
export * from './sessions/upload.js'
export * from './sessions/ai-analysis.js'

// Metrics types
export * from './metrics/types.js'
export * from './metrics/performance.js'
export * from './metrics/usage.js'
export * from './metrics/errors.js'
export * from './metrics/engagement.js'
export * from './metrics/quality.js'
export * from './metrics/assessment.js'
export * from './metrics/git-diff.js'
export * from './metrics/context.js'
export * from './metrics/utilities.js'

// GitHub integration types
export * from './github/app.js'
export * from './github/webhooks.js'
export * from './github/teams.js'
export * from './github/sync.js'

// Jira integration types
export * from './jira/index.js'

// Work tracking types (issues, PRs, deployments)
export * from './work-tracking/index.js'

// Queue message types
export * from './queue/messages.js'

// Existing standalone types (keep as-is)
export * from './auth.js'
export * from './permissions.js'
export * from './git.js'
export * from './processor.js'
export * from './surveys.js'

// AIVA assessment types
export * from './surveys/aiva.js'

// AIVA enablement framework types
export * from './surveys/aiva-enablement.js'

// Canonical validation (Zod schemas and validation functions)
export * from './canonical-validation.js'

// Shared content block types (used across all providers)
export type {
  ContentBlock,
  MessageContent,
  StructuredMessageContent,
  TextContent,
  ToolUseContent,
  ToolResultContent,
  ThinkingContent,
  ImageContent,
  SystemReminderContent,
  UnknownContent,
} from './providers/shared/index.js'

export {
  isTextContent,
  isToolUseContent,
  isToolResultContent,
  isThinkingContent,
  isImageContent,
  isSystemReminderContent,
  isStructuredMessageContent,
  extractContentBlocks,
  getTextFromContent,
  hasToolUses,
  hasToolResults,
} from './providers/shared/index.js'

// Provider-specific schemas (Zod)
export * as Providers from './providers/index.js'

// Gemini provider types
export type {
  GeminiMessage,
  Thought,
  TokenMetrics,
  GeminiMetadata,
} from './providers/gemini/index.js'
export {
  GeminiMessageSchema,
  isGeminiMessage,
  hasGeminiThoughts,
  hasGeminiTokens,
  calculateCacheHitRate,
  calculateThinkingOverhead,
} from './providers/gemini/index.js'

// GitHub Copilot provider types
export type {
  TimelineEntry,
  TimelineEntryType,
  ToolCallResult,
  CopilotSession,
  CopilotMetadata,
} from './providers/copilot/index.js'
export {
  TimelineEntrySchema,
  CopilotSessionSchema,
  isTimelineEntry,
  isUserEntry,
  isCopilotEntry,
  isToolCallEntry,
  isToolResultEntry,
  isInfoEntry,
  pairToolCallWithResult,
} from './providers/copilot/index.js'
