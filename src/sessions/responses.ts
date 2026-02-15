import type { AIModelMetadata, SessionPhaseAnalysis } from './ai-analysis.js'
import type { AgentSession, ProcessingStatus, SessionFile } from './core.js'

// Session API response types

/**
 * Linked session summary - used for parent/child session cards
 */
export interface LinkedSession {
  id: string
  sessionId: string
  provider: string
  username: string
  repositoryName: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  fileSize: number | null
  filePath: string | null
  processingStatus: string
  assessmentStatus: string
  assessmentRating: string | null
  aiModelSummary: string | null
  aiModelQualityScore: number | null
  gitBranch: string | null
  firstCommitHash: string | null
  latestCommitHash: string | null
  createdAt: string
}

/**
 * Session detail response - complete session information
 */
export interface SessionDetailResponse {
  id: string
  sessionId: string
  provider: string
  repositoryName: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  fileName: string | null
  filePathR2: string | null
  fileSize: number | null
  uploadedAt: string
  processingStatus: ProcessingStatus
  queuedAt: string | null
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
  username: string
  userAvatarUrl: string | null
  repository: {
    id: string
    name: string
    gitRemoteUrl: string | null
    cwd: string
    detectedType: string | null
  } | null
  // Session stitching
  parentSessionId: string | null
  // Pull request information (if linked to a GitHub PR)
  pullRequest?: {
    url: string
    number: number
    title: string | null
    state: string
    headBranch: string
    baseBranch: string
    repoFullName: string
  } | null
  // Linked sessions (plan → implementation chain)
  parentSession?: LinkedSession | null
  childSessions?: LinkedSession[]
}

/**
 * Sessions list response - paginated session list
 */
export interface SessionsResponse {
  sessions: AgentSession[]
  pagination: {
    limit: number
    offset: number
    hasMore: boolean
  }
  totalSessionsOtherUsers?: number // Count of sessions by other users (when userFilter is 'mine' and no results)
}

/**
 * @deprecated Use SessionDetailResponse instead
 * Session files response - legacy format
 */
export interface SessionFilesResponse {
  sessionId: string
  provider: string
  repositoryName: string
  sessionStartTime: string | null
  sessionEndTime: string | null
  durationMs: number | null
  processingStatus: ProcessingStatus
  processedAt: string | null
  aiModelSummary: string | null
  aiModelQualityScore: number | null
  aiModelMetadata: AIModelMetadata | null
  aiModelPhaseAnalysis: SessionPhaseAnalysis | null
  username: string
  userAvatarUrl: string | null
  repository?: {
    id: string
    name: string
    gitRemoteUrl: string | null
    cwd: string
    detectedType: string | null
  } | null
  files: SessionFile[]
}

/**
 * Session filters - query parameters for listing sessions
 */
export interface SessionFilters {
  provider?: string
  repositoryId?: string
  userFilter?: 'everyone' | 'mine'
  sortOrder?: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc'
  dateFilter?: 'all' | 'last24hrs' | 'today' | 'yesterday' | 'this-week' | 'last-week' | 'range'
  dateRange?: { from: string; to: string }
  limit?: number
  offset?: number
}
