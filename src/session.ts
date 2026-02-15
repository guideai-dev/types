// Session types - moved to sessions/ directory

// Re-export for backward compatibility
export type {
  ProcessingStatus,
  ProviderMetadata,
  SessionPhaseType,
  SessionPhase,
  AgentSession,
  SessionFile,
  SessionFileContent,
} from './sessions/core.js'

export type {
  MessageType,
  ParsedMessage,
  ParsedSession,
  BaseSessionMessage,
  ConversationTurn,
  SessionParser,
  ProviderAdapter,
  SessionViewerProps,
  ClaudeMessage,
} from './sessions/messages.js'

export type {
  LinkedSession,
  SessionDetailResponse,
  SessionsResponse,
  SessionFilesResponse,
  SessionFilters,
} from './sessions/responses.js'

export type {
  SessionUploadRequest,
  SessionUploadResponse,
  SessionMetricUpload,
  SessionMetricsUploadRequest,
  SessionMetricsUploadResponse,
} from './sessions/upload.js'

export type {
  IntentExtractionResult,
  QualityAssessmentResult,
  SessionSummaryResult,
  AIModelMetadata,
  SessionPhaseAnalysis,
} from './sessions/ai-analysis.js'
