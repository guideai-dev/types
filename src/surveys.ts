import { z } from 'zod'

// =============================================================================
// SURVEY CHOICE TYPE
// =============================================================================

/**
 * A choice option for survey questions with a stable ID.
 * The ID remains constant even if the display text is updated.
 */
export interface SurveyChoice {
  /** Stable identifier (e.g., "never", "reactive", "level_1") */
  id: string
  /** Display text shown to respondents */
  text: string
}

export const surveyChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
})

/**
 * Get the display text for a choice value.
 * Handles both new ID-based values (string) and legacy index-based values (number).
 *
 * @param choices - Array of SurveyChoice objects
 * @param value - The response value (choice ID or legacy index)
 * @returns The display text, or undefined if not found
 */
export function getChoiceText(
  choices: SurveyChoice[] | undefined,
  value: string | number
): string | undefined {
  if (!choices || choices.length === 0) return undefined

  // New format: ID lookup (string value)
  if (typeof value === 'string') {
    return choices.find(c => c.id === value)?.text
  }

  // Legacy format: Index lookup (for historical data display only)
  if (typeof value === 'number' && value >= 0 && value < choices.length) {
    return choices[value]?.text
  }

  return undefined
}

// Schedule Types
export type ScheduleType = 'weekly' | 'biweekly' | 'monthly' | 'triggered' | 'manual'
export type TargetType = 'organization' | 'teams' | 'individual'
export type SurveyStatus = 'pending' | 'completed' | 'expired'

// Trigger Configuration
export interface TriggerConfig {
  type: 'session_count'
  threshold: number
}

export const triggerConfigSchema = z.object({
  type: z.literal('session_count'),
  threshold: z.number().int().positive(),
})

// Question Configuration (for schedule customization)
export interface QuestionConfigItem {
  id: string // Question ID
  enabled: boolean // Whether question is shown
  order: number // Display order (0-indexed)
}

export interface QuestionConfig {
  version: string // Config version (e.g., "1.0")
  questions: QuestionConfigItem[]
}

export const questionConfigItemSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
  order: z.number().int().min(0),
})

export const questionConfigSchema = z.object({
  version: z.string(),
  questions: z.array(questionConfigItemSchema),
})

// Survey Purpose
export type SurveyPurpose =
  | 'discovery'
  | 'delivery'
  | 'whole_team'
  | 'happiness'
  | 'ai_effectiveness'
  | 'aiva'

// =============================================================================
// SURVEY DEFINITIONS (tenant-scoped survey templates; NULL tenantId = system)
// =============================================================================

/**
 * A section grouping questions within a survey definition.
 * Sections are authoring metadata; the take-survey flow flattens questions in section order.
 */
export interface SurveySection {
  id: string
  title: string
  description?: string
}

export const surveySectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
})

export type SurveyDefinitionStatus = 'draft' | 'active' | 'archived'

/**
 * A survey definition: the questions (and optional sections) that make up a survey.
 * System definitions (tenantId = null) are the built-in templates; tenant definitions
 * are org-private, created by cloning a template or importing from markdown.
 */
export interface SurveyDefinition {
  id: string
  tenantId: string | null
  surveyKey: string
  name: string
  description?: string | null
  status: SurveyDefinitionStatus
  sourceMarkdown?: string | null
  questions: SurveyQuestion[]
  sections?: SurveySection[] | null
  version: number
  clonedFromId?: string | null
  createdBy?: string | null
  createdAt: Date
  updatedAt: Date
}

// Survey Instance Metadata (for survey-type-specific data)
export interface SurveyInstanceMetadata {
  /** AIVA respondent role (only set for AIVA surveys) */
  aivaRole?: 'leadership' | 'product' | 'engineering' | 'architecture' | 'operations'
}

// Survey Schedule
export type DistributionMode = 'email' | 'link'

export interface SurveySchedule {
  id: string
  tenantId: string
  name: string
  description?: string | null
  surveyType: string
  purpose?: SurveyPurpose | null
  scheduleType: ScheduleType
  dayOfWeek?: number | null // 0=Sunday, 6=Saturday (for weekly schedules)
  dayOfMonth?: number | null // 1-31 business day (for monthly schedules)
  timeOfDay?: string | null // HH:MM format (24-hour)
  triggerConfig?: TriggerConfig | null
  questionConfig?: QuestionConfig | null
  definitionId?: string | null
  aivaVariant?: 'full' | 'light' // AIVA-only: 'light' asks a faster subset of questions
  randomizeQuestionOrder: boolean
  textQuestionsAtEnd: boolean
  distributionMode: DistributionMode
  targetType: TargetType
  targetUserIds?: string[] | null
  targetTeamIds?: string[] | null
  isActive: boolean
  createdBy?: string | null
  createdAt: Date
  updatedAt: Date
}

// Base schema without refinements
const surveyScheduleBaseSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  surveyType: z.string().default('team_experience'),
  purpose: z
    .enum(['discovery', 'delivery', 'whole_team', 'happiness', 'ai_effectiveness', 'aiva'])
    .optional(),
  scheduleType: z.enum(['weekly', 'biweekly', 'monthly', 'triggered', 'manual']),
  dayOfWeek: z.number().int().min(0).max(6).optional(), // 0=Sunday, 6=Saturday
  dayOfMonth: z.number().int().min(1).max(31).optional(), // Business day 1-31
  timeOfDay: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(), // HH:MM 24-hour
  triggerConfig: triggerConfigSchema.optional(),
  questionConfig: questionConfigSchema.nullable().optional(),
  definitionId: z.string().uuid().optional(),
  aivaVariant: z.enum(['full', 'light']).default('full'), // AIVA-only: 'light' asks a faster subset
  randomizeQuestionOrder: z.boolean().default(true),
  textQuestionsAtEnd: z.boolean().default(true),
  distributionMode: z.enum(['email', 'link']).default('email'),
  targetType: z.enum(['organization', 'teams', 'individual']),
  targetUserIds: z.array(z.string().uuid()).optional(),
  targetTeamIds: z.array(z.string().uuid()).optional(),
  isActive: z.boolean().default(true),
})

// Create schema with refinements
export const surveyScheduleCreateSchema = surveyScheduleBaseSchema
  .refine(
    data => {
      // Weekly schedules must have dayOfWeek and timeOfDay
      if (data.scheduleType === 'weekly') {
        return data.dayOfWeek !== undefined && data.timeOfDay !== undefined
      }
      return true
    },
    {
      message: 'Weekly schedules require dayOfWeek and timeOfDay',
      path: ['dayOfWeek'],
    }
  )
  .refine(
    data => {
      // Biweekly schedules must have dayOfWeek and timeOfDay
      if (data.scheduleType === 'biweekly') {
        return data.dayOfWeek !== undefined && data.timeOfDay !== undefined
      }
      return true
    },
    {
      message: 'Biweekly schedules require dayOfWeek and timeOfDay',
      path: ['dayOfWeek'],
    }
  )
  .refine(
    data => {
      // Monthly schedules must have dayOfMonth and timeOfDay
      if (data.scheduleType === 'monthly') {
        return data.dayOfMonth !== undefined && data.timeOfDay !== undefined
      }
      return true
    },
    {
      message: 'Monthly schedules require dayOfMonth and timeOfDay',
      path: ['dayOfMonth'],
    }
  )
  .refine(
    data => {
      // textQuestionsAtEnd only applies when randomizeQuestionOrder is true
      if (!data.randomizeQuestionOrder && data.textQuestionsAtEnd) {
        return false
      }
      return true
    },
    {
      message: 'textQuestionsAtEnd can only be true when randomizeQuestionOrder is true',
      path: ['textQuestionsAtEnd'],
    }
  )

// Update schema - partial of base schema (before refinements)
export const surveyScheduleUpdateSchema = surveyScheduleBaseSchema.partial()

// Survey Instance
export interface SurveyInstance {
  id: string
  tenantId: string
  scheduleId: string
  userId: string
  status: SurveyStatus
  dueDate: Date
  sentAt?: Date | null
  reminderSentAt?: Date | null
  completedAt?: Date | null
  createdAt: Date
  surveyResponseId?: string | null
  metadata?: SurveyInstanceMetadata | null
}

// Survey Response
export interface SurveyResponse {
  id: string
  tenantId: string
  userId: string
  surveyInstanceId?: string | null
  surveyType: string
  durationSeconds?: number | null
  completedAt: Date
  createdAt: Date

  /** Raw SurveyQuestionResponse[] as submitted (all survey types) */
  responses?: SurveyQuestionResponse[] | null
}

// Backward compatibility alias
export type TeamExperienceSurveyResponse = SurveyResponse

// Survey Question Response (API format)
export interface SurveyQuestionResponse {
  questionId: string
  value: string | number | boolean | string[] | number[] | null // Arrays for multiSelect questions
}

export const surveyResponseSchema = z.object({
  responses: z.array(
    z.object({
      questionId: z.string(),
      value: z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.string()),
        z.array(z.number()),
        z.null(),
      ]),
    })
  ),
  durationSeconds: z.number().optional(),
})

// Question Types
export type QuestionType =
  | 'likert-7'
  | 'likert-5'
  | 'nps'
  | 'text'
  | 'choice'
  | 'number'
  | 'boolean'
export type QuestionCategory =
  | 'productivity'
  | 'satisfaction'
  | 'ai_tools'
  | 'collaboration'
  | 'learning'
  | 'wellbeing'
  | 'feedback'
  | 'discovery_satisfaction'
  | 'discovery_activity'
  | 'discovery_collaboration'
  | 'discovery_efficiency'
  | 'delivery_performance'
  | 'delivery_efficiency'
  | 'delivery_collaboration'
  | 'delivery_activity'

export interface SurveyQuestion {
  id: string
  text: string
  type: QuestionType
  category: QuestionCategory
  required: boolean
  /** Section this question belongs to (references SurveySection.id on the definition) */
  sectionId?: string
  labels?: [string, string] // [min, max] for scales / [no, yes] for boolean
  choices?: SurveyChoice[] // Array of choice objects with stable IDs
  placeholder?: string
  helpText?: string
  reverseScored?: boolean
  skipLabel?: string // Optional custom label for skip button (e.g., "Skip this question")
  min?: number // For number type
  max?: number // For number type
  multiSelect?: boolean // For multi-select choice questions (e.g., AIVA evidence checklists)
  // Optional fields for compatibility with AssessmentQuestionConfig
  importance?: 'low' | 'medium' | 'high'
  version?: string[]
  // AIVA-specific fields (embedded from dimension config)
  roles?: ('leadership' | 'product' | 'engineering' | 'architecture' | 'operations')[]
  dimensionContributions?: Array<{ dimension: string; weight: number }>
  aivaType?:
    | 'scenario-choice'
    | 'frequency-scale'
    | 'evidence-checklist'
    | 'comparison-anchor'
    | 'open-feedback'
  scoringMode?: 'highest-tier' | 'count-based' | 'cumulative'
  frequencyMapping?: Record<string, number> // Maps choice ID to score
  itemTiers?: Record<string, number> // Maps choice ID to tier score
}

export interface SurveyQuestionConfig {
  version: string
  questions: SurveyQuestion[]
}

export const questionTypeSchema = z.enum([
  'likert-7',
  'likert-5',
  'nps',
  'text',
  'choice',
  'number',
  'boolean',
])

// =============================================================================
// MARKDOWN → SURVEY CONVERSION CONTRACTS
// =============================================================================

/**
 * Strict schema for a single AI-converted survey question.
 * Enforces slug ids, choice minimums, and scale labels so invalid AI output
 * fails validation (and triggers a repair pass) rather than saving broken surveys.
 */
export const aiConvertedQuestionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/, 'Question id must be a lowercase slug'),
    text: z.string().min(1),
    type: questionTypeSchema,
    category: z
      .enum([
        'productivity',
        'satisfaction',
        'ai_tools',
        'collaboration',
        'learning',
        'wellbeing',
        'feedback',
        'discovery_satisfaction',
        'discovery_activity',
        'discovery_collaboration',
        'discovery_efficiency',
        'delivery_performance',
        'delivery_efficiency',
        'delivery_collaboration',
        'delivery_activity',
      ])
      .default('feedback'),
    required: z.boolean(),
    labels: z.tuple([z.string(), z.string()]).optional(),
    choices: z.array(surveyChoiceSchema).optional(),
    multiSelect: z.boolean().optional(),
    helpText: z.string().optional(),
    placeholder: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    sectionId: z.string().optional(),
  })
  .refine(q => q.type !== 'choice' || (q.choices !== undefined && q.choices.length >= 2), {
    message: 'Choice questions require at least 2 choices',
    path: ['choices'],
  })
  .refine(q => !['likert-5', 'likert-7'].includes(q.type) || q.labels !== undefined, {
    message: 'Likert questions require [min, max] labels',
    path: ['labels'],
  })

/**
 * The editable draft produced by markdown conversion, held client-side
 * until saved as a survey definition.
 */
export interface SurveyDraftPayload {
  name: string
  description?: string
  questions: SurveyQuestion[]
  sections: SurveySection[]
}

export const surveyDraftPayloadSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  questions: z.array(aiConvertedQuestionSchema),
  sections: z.array(surveySectionSchema),
})

export interface ConvertSurveyMarkdownRequest {
  markdown: string
  /** User feedback for a re-run; the AI keeps existing ids stable and applies only this */
  feedback?: string
  /** Previous draft, supplied on re-run so question/choice/section ids stay stable */
  previousDraft?: SurveyDraftPayload
}

export interface ConvertSurveyMarkdownResponse {
  success: boolean
  draft?: SurveyDraftPayload
  /** Non-fatal conversion notes (e.g. unsupported "Other" free-text mapped to a plain choice) */
  warnings: string[]
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}
