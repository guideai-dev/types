import type { SurveyChoice } from '../surveys.js'
import type { BaseMetrics } from './types.js'

// Assessment system types

/**
 * Assessment metrics for user feedback
 */
export interface AssessmentMetrics extends BaseMetrics {
  completed_at: string
  duration_seconds?: number
  survey_type?: 'short' | 'standard' | 'full' | 'quick'

  // Usefulness category
  task_helpfulness?: number
  effort_impact?: string
  speed_comparison?: string

  // Trust category
  verification_frequency?: number
  deployment_confidence?: number
  error_detectability?: string

  // Cognitive category
  cognitive_load?: number
  mental_alignment?: number
  user_control?: number

  // Learning category
  learning_outcome?: string
  understanding_depth?: string
  growth_impact?: string

  // Satisfaction category
  nps_score?: number
  task_enjoyment?: string
  stuck_frequency?: string

  // Comparison category
  ai_perception?: string
  pair_programming_comparison?: number
  future_preference?: string

  // Reflection category
  best_contribution?: string
  worst_experience?: string
  improvement_suggestion?: string
}

/**
 * Assessment answer types (used for API request/response)
 */
export type AssessmentAnswer =
  | { type: 'likert'; value: number }
  | { type: 'text'; value: string }
  | { type: 'choice'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'skipped' }

/**
 * Assessment status
 */
export type AssessmentStatus = 'not_started' | 'rating_only' | 'in_progress' | 'completed'

/**
 * Assessment question types
 */
export type AssessmentQuestionType = 'likert-5' | 'likert-7' | 'nps' | 'text' | 'choice'

/**
 * Assessment category classification
 */
export type AssessmentCategory =
  | 'usefulness'
  | 'trust'
  | 'cognitive'
  | 'learning'
  | 'satisfaction'
  | 'comparison'
  | 'reflection'

/**
 * Assessment importance level
 */
export type AssessmentImportance = 'low' | 'medium' | 'high'

/**
 * Assessment survey version
 */
export type AssessmentVersion = 'short' | 'medium' | 'long'

/**
 * Assessment question configuration
 */
export interface AssessmentQuestionConfig {
  id: string
  text: string
  type: AssessmentQuestionType
  category: AssessmentCategory
  importance: AssessmentImportance
  version: AssessmentVersion[]
  required: boolean
  skipLabel?: string
  labels?: [string, string] // [min label, max label] for Likert scales
  choices?: SurveyChoice[] // For choice questions (with stable IDs)
  placeholder?: string // For text questions
  helpText?: string
  reverseScored?: boolean // For Likert scales: true if low scores are positive (e.g., "Never" = good)
}

/**
 * Assessment filter criteria
 */
export interface AssessmentFilter {
  importance?: AssessmentImportance[]
  category?: AssessmentCategory[]
  required?: boolean
  version?: AssessmentVersion
}

/**
 * Assessment response entry
 */
export interface AssessmentResponse {
  questionId: string
  answer: AssessmentAnswer
  timestamp: string
}

/**
 * Assessment session data (stored in database)
 */
export interface AssessmentSession {
  id: string
  sessionId: string
  tenantId: string
  userId: string
  provider: string

  // Metadata
  surveyType?: 'short' | 'standard' | 'full' | 'quick'
  durationSeconds?: number
  rating?: 'thumbs_up' | 'meh' | 'thumbs_down'

  // Usefulness category
  taskHelpfulness?: number
  effortImpact?: string
  speedComparison?: string

  // Trust category
  verificationFrequency?: number
  deploymentConfidence?: number
  errorDetectability?: string

  // Cognitive category
  cognitiveLoad?: number
  mentalAlignment?: number
  userControl?: number

  // Learning category
  learningOutcome?: string
  understandingDepth?: string
  growthImpact?: string

  // Satisfaction category
  npsScore?: number
  taskEnjoyment?: string
  stuckFrequency?: string

  // Comparison category
  aiPerception?: string
  pairProgrammingComparison?: number
  futurePreference?: string

  // Reflection category
  bestContribution?: string
  worstExperience?: string
  improvementSuggestion?: string

  // Timestamps
  completedAt: string
  createdAt: string
}

/**
 * Assessment session API response format
 * Includes status and responses array for backward compatibility
 */
export interface Assessment {
  sessionId: string
  status?: AssessmentStatus
  responses: AssessmentResponse[]
  completedAt?: string
  surveyType?: 'quick' | 'standard' | 'short' | 'full'
  rating?: 'thumbs_up' | 'meh' | 'thumbs_down'
}
