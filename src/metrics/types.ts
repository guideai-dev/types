// Metric types and base interfaces

import type { AssessmentMetrics } from './assessment.js'
import type { ContextManagementMetrics } from './context.js'
import type { EngagementMetrics } from './engagement.js'
import type { ErrorMetrics } from './errors.js'
import type { GitDiffMetrics } from './git-diff.js'
import type { PerformanceMetrics } from './performance.js'
import type { QualityMetrics } from './quality.js'
import type { TokenCostMetrics } from './token-cost.js'
import type { UsageMetrics } from './usage.js'

/**
 * Metric type classification
 */
export type MetricType =
  | 'performance'
  | 'usage'
  | 'error'
  | 'custom'
  | 'engagement'
  | 'quality'
  | 'assessment'
  | 'git-diff'
  | 'context-management'
  | 'token-cost'
  | 'performance.duration'
  | 'performance.response-time'
  | 'usage.tool-usage'
  | 'usage.user-input'
  | 'engagement.interruptions'
  | 'quality.completion'

/**
 * Base metric data structure stored in JSONB
 */
export interface BaseMetrics {
  [key: string]: string | number | boolean | object | null | undefined
}

/**
 * Custom metrics for extensibility
 */
export interface CustomMetrics extends BaseMetrics {
  // Inherits index signature from BaseMetrics
}

/**
 * Union type for all possible metrics
 */
export type SessionMetricsData =
  | PerformanceMetrics
  | UsageMetrics
  | ErrorMetrics
  | EngagementMetrics
  | QualityMetrics
  | AssessmentMetrics
  | GitDiffMetrics
  | ContextManagementMetrics
  | TokenCostMetrics
  | CustomMetrics

/**
 * Metadata that can be attached to metrics
 */
export interface MetricMetadata {
  source?: string
  version?: string
  environment?: string
  tags?: string[]
  context?: {
    project_type?: string
    user_experience_level?: string
    session_type?: string
    // biome-ignore lint/suspicious/noExplicitAny: Context can contain arbitrary metadata
    [key: string]: any
  }
}
