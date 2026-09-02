// Metrics types - moved to metrics/ directory

// Re-export for backward compatibility
export type {
  MetricType,
  BaseMetrics,
  CustomMetrics,
  SessionMetricsData,
  MetricMetadata,
} from './metrics/types.js'

export type { PerformanceMetrics } from './metrics/performance.js'
export type { UsageMetrics } from './metrics/usage.js'
export type { ErrorMetrics } from './metrics/errors.js'
export type { EngagementMetrics } from './metrics/engagement.js'
export type { QualityMetrics } from './metrics/quality.js'
export type { GitDiffMetrics } from './metrics/git-diff.js'
export type { ContextManagementMetrics } from './metrics/context.js'
export type { SessionModelUsage, TokenCostMetrics } from './metrics/token-cost.js'

export type {
  AssessmentMetrics,
  AssessmentAnswer,
  AssessmentStatus,
  AssessmentQuestionType,
  AssessmentCategory,
  AssessmentImportance,
  AssessmentVersion,
  AssessmentQuestionConfig,
  AssessmentFilter,
  AssessmentResponse,
  AssessmentSession,
} from './metrics/assessment.js'

// Re-export utility functions
export {
  extractToolUses,
  extractToolResults,
  extractTextFromMessage,
  countToolUsesByName,
  isErrorResult,
  filterErrorResults,
  filterSuccessResults,
  pairToolUsesWithResults,
  filterMessagesByType,
  getUserMessages,
  getAssistantMessages,
  countMessagesByType,
  calculateMessageLengthStats,
  messageHasToolUses,
  messageHasToolResults,
  messageHasThinking,
} from './metrics/utilities.js'
