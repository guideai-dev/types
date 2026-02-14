import type { CopilotMetadata } from '../providers/copilot/index.js'
import type { GeminiMetadata } from '../providers/gemini/index.js'
import type { AIModelMetadata, SessionPhaseAnalysis } from './ai-analysis.js'

// Session core types

/**
 * Processing status for async operations
 */
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Provider-specific metadata
 * Use discriminated union to enable type narrowing
 */
export type ProviderMetadata =
  | { provider: 'claude-code'; metadata?: Record<string, unknown> }
  | { provider: 'codex'; metadata?: Record<string, unknown> }
  | { provider: 'opencode'; metadata?: Record<string, unknown> }
  | { provider: 'gemini-code'; metadata?: GeminiMetadata }
  | { provider: 'github-copilot'; metadata?: CopilotMetadata }
  | { provider: string; metadata?: Record<string, unknown> } // Catch-all

/**
 * Session Phase Types
 * Represents the different phases a coding session can go through
 */
export type SessionPhaseType =
  | 'initial_specification'
  | 'analysis_planning'
  | 'plan_modification'
  | 'plan_agreement'
  | 'execution'
  | 'interruption'
  | 'task_assignment'
  | 'completion'
  | 'correction'
  | 'final_completion'
  | 'other'

/**
 * Phase in the session timeline
 */
export interface SessionPhase {
  phaseType: SessionPhaseType
  startStep: number
  endStep: number
  stepCount: number
  summary: string
  durationMs: number
  timestamp?: string
}

/**
 * Agent session entity - represents a single coding session
 */
export interface AgentSession {
  id: string
  provider: string
  repositoryName: string
  repositoryId: string | null // Foreign key to repositories table (desktop only)
  sessionId: string
  fileName: string | null
  filePath: string | null // Path to session file (R2 path for server, local path for desktop)
  fileSize: number | null
  userId: string
  username: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  processingStatus: ProcessingStatus
  processedAt: string | null
  coreMetricsStatus: ProcessingStatus
  coreMetricsProcessedAt: string | null
  assessmentStatus: 'not_started' | 'rating_only' | 'in_progress' | 'completed'
  assessmentCompletedAt: string | null
  assessmentRating: 'thumbs_up' | 'meh' | 'thumbs_down' | null
  aiModelSummary: string | null
  aiModelQualityScore: number | null
  aiModelMetadata: AIModelMetadata | null
  aiModelPhaseAnalysis: SessionPhaseAnalysis | null
  // Git tracking fields (session-specific)
  gitBranch: string | null
  firstCommitHash: string | null
  latestCommitHash: string | null
  // Session stitching
  parentSessionId: string | null
  createdAt: string
  uploadedAt: string
}

/**
 * Session file entity - represents an uploaded session file
 */
export interface SessionFile {
  id: string
  fileName: string
  filePathR2: string
  fileSize: number
  uploadedAt: string
}

/**
 * Session file content - file data with metadata
 */
export interface SessionFileContent {
  fileName: string
  content: string
  size: number
  lastModified: string
}
