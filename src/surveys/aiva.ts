// AIVA Assessment Types v2
// Inference-first model with role-based questions and composite scoring

// =============================================================================
// CORE ENUMS AND TYPES
// =============================================================================

/**
 * Question types for engaging, inference-first assessment
 * - scenario-choice: Real-world scenarios with 4 options mapping to maturity levels
 * - frequency-scale: "How often does X happen?" with frequency-to-maturity mapping
 * - evidence-checklist: Select evidence items present, score by tier
 * - comparison-anchor: Compare org to described anchors (A/B/C/D)
 * - open-feedback: Open-ended text question for additional feedback
 */
export type AIVAQuestionType =
  | 'scenario-choice'
  | 'frequency-scale'
  | 'evidence-checklist'
  | 'comparison-anchor'
  | 'open-feedback'

/**
 * Respondent roles - each gets a tailored subset of questions
 */
export type AIVARespondentRole = 'leadership' | 'product' | 'engineering' | 'operations'

/**
 * Confidence levels based on evidence quality and source count
 */
export type AIVAConfidence = 'low' | 'medium' | 'high'

/**
 * Value Stream phases
 */
export type AIVAValueStreamPhase = 'discovery' | 'delivery' | 'validation' | 'foundations'

/**
 * Capability layers
 */
export type AIVACapabilityLayer =
  | 'strategyAndCulture'
  | 'peopleAndSkills'
  | 'waysOfWorking'
  | 'technicalPlatform'
  | 'governanceAndEnablers'
  | 'externalInterfaces'

// =============================================================================
// DIMENSION DEFINITIONS
// =============================================================================

/**
 * All dimensions organized by category.
 *
 * Value Stream has two levels:
 * - Parent phases (vsDiscovery, etc.) are COMPUTED as averages of sub-dimensions
 * - Sub-dimensions (vsDiscoveryResearch, etc.) are SCORED by questions
 *
 * Capabilities remain unchanged (30 dimensions across 6 layers).
 *
 * Total scored dimensions: 16 VS sub-dimensions + 30 capability = 46
 * Total computed dimensions: 4 VS parent phases
 */
export const AIVA_DIMENSIONS = {
  // Parent VS phases - COMPUTED as averages of sub-dimensions, not directly scored
  valueStream: ['vsDiscovery', 'vsDelivery', 'vsValidation', 'vsFoundations'] as const,

  // VS Sub-dimensions - SCORED by questions (4 per phase = 16 total)
  discovery: [
    'vsDiscoveryResearch',
    'vsDiscoveryClarity',
    'vsDiscoveryPrioritization',
    'vsDiscoveryCollaboration',
  ] as const,
  delivery: [
    'vsDeliveryVelocity',
    'vsDeliveryQuality',
    'vsDeliveryRelease',
    'vsDeliveryFlow',
  ] as const,
  validation: [
    'vsValidationFeedback',
    'vsValidationExperimentation',
    'vsValidationDecisions',
    'vsValidationMetrics',
  ] as const,
  foundations: [
    'vsFoundationsDx',
    'vsFoundationsKnowledge',
    'vsFoundationsObservability',
    'vsFoundationsGovernance',
  ] as const,

  // Capability dimensions - unchanged (6 layers x 5 = 30)
  strategyAndCulture: [
    'capScLeadership',
    'capScAiVision',
    'capScExperimentation',
    'capScLearning',
    'capScChangeReadiness',
  ] as const,
  peopleAndSkills: [
    'capPsAiFluency',
    'capPsPromptEngineering',
    'capPsGrowthFrameworks',
    'capPsRoleEvolution',
    'capPsTalentStrategy',
  ] as const,
  waysOfWorking: [
    'capWowTeamTopology',
    'capWowRituals',
    'capWowDecisionMaking',
    'capWowCrossFunctional',
    'capWowPrioritization',
  ] as const,
  technicalPlatform: [
    'capTpDesignSystem',
    'capTpGoldenPaths',
    'capTpCiCd',
    'capTpAiTooling',
    'capTpObservability',
  ] as const,
  governanceAndEnablers: [
    'capGeCompliance',
    'capGeSecurity',
    'capGeCostManagement',
    'capGeQualityGates',
    'capGeDataGovernance',
  ] as const,
  externalInterfaces: [
    'capEiStakeholderLiteracy',
    'capEiCustomerValidation',
    'capEiVendorAlignment',
    'capEiRegulatory',
    'capEiDependencyManagement',
  ] as const,
} as const

/**
 * Value Stream sub-dimension types
 */
export type AIVAValueStreamSubDimension =
  | (typeof AIVA_DIMENSIONS.discovery)[number]
  | (typeof AIVA_DIMENSIONS.delivery)[number]
  | (typeof AIVA_DIMENSIONS.validation)[number]
  | (typeof AIVA_DIMENSIONS.foundations)[number]

/**
 * All dimension types including parent VS phases, VS sub-dimensions, and capabilities
 */
export type AIVADimension =
  | (typeof AIVA_DIMENSIONS.valueStream)[number]
  | AIVAValueStreamSubDimension
  | (typeof AIVA_DIMENSIONS.strategyAndCulture)[number]
  | (typeof AIVA_DIMENSIONS.peopleAndSkills)[number]
  | (typeof AIVA_DIMENSIONS.waysOfWorking)[number]
  | (typeof AIVA_DIMENSIONS.technicalPlatform)[number]
  | (typeof AIVA_DIMENSIONS.governanceAndEnablers)[number]
  | (typeof AIVA_DIMENSIONS.externalInterfaces)[number]

/**
 * Mapping from parent VS phase to its sub-dimensions
 */
export const VS_PHASE_SUB_DIMENSIONS: Record<
  AIVAValueStreamPhase,
  readonly AIVAValueStreamSubDimension[]
> = {
  discovery: AIVA_DIMENSIONS.discovery,
  delivery: AIVA_DIMENSIONS.delivery,
  validation: AIVA_DIMENSIONS.validation,
  foundations: AIVA_DIMENSIONS.foundations,
}

/**
 * Human-readable names for VS sub-dimensions
 */
export const VS_SUB_DIMENSION_NAMES: Record<AIVAValueStreamSubDimension, string> = {
  vsDiscoveryResearch: 'Research & Insights',
  vsDiscoveryClarity: 'Problem Definition',
  vsDiscoveryPrioritization: 'Prioritization',
  vsDiscoveryCollaboration: 'Cross-functional Discovery',
  vsDeliveryVelocity: 'Development Speed',
  vsDeliveryQuality: 'Quality & Review',
  vsDeliveryRelease: 'Release Capability',
  vsDeliveryFlow: 'Flow Efficiency',
  vsValidationFeedback: 'Feedback Loops',
  vsValidationExperimentation: 'Experimentation',
  vsValidationDecisions: 'Evidence-based Decisions',
  vsValidationMetrics: 'Outcome Measurement',
  vsFoundationsDx: 'Developer Experience',
  vsFoundationsKnowledge: 'Knowledge & Onboarding',
  vsFoundationsObservability: 'Observability & Reliability',
  vsFoundationsGovernance: 'Enabling Governance',
}

/**
 * Get the parent VS phase for a sub-dimension
 */
export function getParentPhase(subDim: AIVAValueStreamSubDimension): AIVAValueStreamPhase {
  if (AIVA_DIMENSIONS.discovery.includes(subDim as (typeof AIVA_DIMENSIONS.discovery)[number]))
    return 'discovery'
  if (AIVA_DIMENSIONS.delivery.includes(subDim as (typeof AIVA_DIMENSIONS.delivery)[number]))
    return 'delivery'
  if (AIVA_DIMENSIONS.validation.includes(subDim as (typeof AIVA_DIMENSIONS.validation)[number]))
    return 'validation'
  return 'foundations'
}

/**
 * Check if a dimension is a VS sub-dimension (scored) vs parent phase (computed)
 */
export function isVsSubDimension(dim: AIVADimension): dim is AIVAValueStreamSubDimension {
  return (
    (AIVA_DIMENSIONS.discovery as readonly string[]).includes(dim) ||
    (AIVA_DIMENSIONS.delivery as readonly string[]).includes(dim) ||
    (AIVA_DIMENSIONS.validation as readonly string[]).includes(dim) ||
    (AIVA_DIMENSIONS.foundations as readonly string[]).includes(dim)
  )
}

/**
 * Check if a dimension is a computed parent VS phase
 */
export function isVsParentPhase(
  dim: AIVADimension
): dim is (typeof AIVA_DIMENSIONS.valueStream)[number] {
  return (AIVA_DIMENSIONS.valueStream as readonly string[]).includes(dim)
}

/**
 * Get all scored dimensions (VS sub-dimensions + capabilities).
 * These are the dimensions that questions contribute to directly.
 * Parent VS phases are excluded as they are computed from sub-dimensions.
 */
export function getAllScoredDimensions(): AIVADimension[] {
  return [
    ...AIVA_DIMENSIONS.discovery,
    ...AIVA_DIMENSIONS.delivery,
    ...AIVA_DIMENSIONS.validation,
    ...AIVA_DIMENSIONS.foundations,
    ...AIVA_DIMENSIONS.strategyAndCulture,
    ...AIVA_DIMENSIONS.peopleAndSkills,
    ...AIVA_DIMENSIONS.waysOfWorking,
    ...AIVA_DIMENSIONS.technicalPlatform,
    ...AIVA_DIMENSIONS.governanceAndEnablers,
    ...AIVA_DIMENSIONS.externalInterfaces,
  ]
}

/**
 * Get all dimension keys as a flat array (includes parent VS phases, sub-dims, and capabilities).
 * For scored-only dimensions, use getAllScoredDimensions() instead.
 */
export function getAllDimensions(): AIVADimension[] {
  return [
    ...AIVA_DIMENSIONS.valueStream,
    ...AIVA_DIMENSIONS.discovery,
    ...AIVA_DIMENSIONS.delivery,
    ...AIVA_DIMENSIONS.validation,
    ...AIVA_DIMENSIONS.foundations,
    ...AIVA_DIMENSIONS.strategyAndCulture,
    ...AIVA_DIMENSIONS.peopleAndSkills,
    ...AIVA_DIMENSIONS.waysOfWorking,
    ...AIVA_DIMENSIONS.technicalPlatform,
    ...AIVA_DIMENSIONS.governanceAndEnablers,
    ...AIVA_DIMENSIONS.externalInterfaces,
  ]
}

// =============================================================================
// DIMENSION CONFIG TYPES (v2)
// =============================================================================

/**
 * How a question contributes to a dimension's score
 */
export interface AIVADimensionContribution {
  dimension: AIVADimension
  weight: number // 0.0 to 1.0, how strongly this question affects the dimension
}

/**
 * Entry in the dimension config for a single question
 * Maps question ID to scoring/dimension information
 */
export interface AIVAQuestionDimensionEntry {
  /** Original AIVA question type (for calibration logic reference) */
  aivaType: 'scenario-choice' | 'frequency-scale' | 'evidence-checklist' | 'comparison-anchor' | 'open-feedback'

  /** Dimension contributions with weights */
  contributes: AIVADimensionContribution[]

  /** Role targeting (which roles see this question) */
  roles: AIVARespondentRole[]

  /** For evidence-checklist: scoring mode */
  scoringMode?: 'highest-tier' | 'count-based' | 'cumulative'

  /**
   * ID-based score mappings.
   * Maps choice IDs to their score values.
   * Required for all AIVA questions.
   *
   * For scenario-choice/comparison-anchor: e.g., { "level_1": 1, "level_2": 2, "level_3": 3, "level_4": 4 }
   * For frequency-scale: e.g., { "never": 1, "rarely": 2, "sometimes": 3, "often": 4, "always": 4 }
   * For evidence-checklist: e.g., { "ci_pipeline": 2, "cd_pipeline": 2, "feature_flags": 3 }
   */
  choiceScoreMapping: Record<string, number>

  // Legacy index-based mappings (deprecated, kept for backward compatibility during migration)
  /** @deprecated Use choiceScoreMapping instead */
  frequencyMapping?: Record<string, number>
  /** @deprecated Use choiceScoreMapping instead */
  itemTiers?: number[]
}

/**
 * Dimension mappings configuration
 * Stores which questions contribute to which dimensions and how
 */
export interface AIVADimensionConfig {
  version: string
  questions: Record<string, AIVAQuestionDimensionEntry>
}

// =============================================================================
// LEGACY QUESTION TYPES (DEPRECATED)
// =============================================================================

/**
 * @deprecated Use standard SurveyQuestion with AIVADimensionConfig instead
 * Base fields shared by all legacy question types
 */
interface AIVAQuestionBase {
  id: string
  text: string
  helpText?: string
  roles: AIVARespondentRole[] // Which roles see this question
  contributes: AIVADimensionContribution[] // Which dimensions this affects
}

/**
 * @deprecated Use standard SurveyQuestion with type: 'choice' instead
 * Scenario-choice question: Present a scenario, user picks which matches their org
 */
export interface AIVAScenarioChoiceQuestion extends AIVAQuestionBase {
  type: 'scenario-choice'
  options: Array<{
    id: string
    text: string
    maturityLevel: 1 | 2 | 3 | 4
  }>
}

/**
 * @deprecated Use standard SurveyQuestion with type: 'choice' instead
 * Frequency-scale question: "How often does X happen?"
 */
export interface AIVAFrequencyScaleQuestion extends AIVAQuestionBase {
  type: 'frequency-scale'
  frequencyLabels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  frequencyMapping: {
    Never: 1 | 2 | 3 | 4
    Rarely: 1 | 2 | 3 | 4
    Sometimes: 1 | 2 | 3 | 4
    Often: 1 | 2 | 3 | 4
    Always: 1 | 2 | 3 | 4
  }
}

/**
 * @deprecated Use standard SurveyQuestion with type: 'choice' and multiSelect: true instead
 * Evidence-checklist question: Check all evidence items that apply
 */
export interface AIVAEvidenceChecklistQuestion extends AIVAQuestionBase {
  type: 'evidence-checklist'
  items: Array<{
    id: string
    text: string
    tier: 1 | 2 | 3 | 4 // Which maturity level this evidence supports
  }>
  scoringMode: 'highest-tier' | 'count-based'
  // highest-tier: score = highest tier among selected items
  // count-based: score based on % of items selected (maps to 1-4)
}

/**
 * @deprecated Use standard SurveyQuestion with type: 'choice' instead
 * Comparison-anchor question: Compare your org to 4 described profiles
 */
export interface AIVAComparisonAnchorQuestion extends AIVAQuestionBase {
  type: 'comparison-anchor'
  anchors: {
    A: { title: string; description: string; maturityLevel: 1 }
    B: { title: string; description: string; maturityLevel: 2 }
    C: { title: string; description: string; maturityLevel: 3 }
    D: { title: string; description: string; maturityLevel: 4 }
  }
}

/**
 * @deprecated Use standard SurveyQuestion[] with AIVADimensionConfig instead
 * Union of all legacy question types
 */
export type AIVAQuestion =
  | AIVAScenarioChoiceQuestion
  | AIVAFrequencyScaleQuestion
  | AIVAEvidenceChecklistQuestion
  | AIVAComparisonAnchorQuestion

/**
 * @deprecated Use SurveyQuestionConfig with AIVADimensionConfig instead
 * Legacy question bank configuration
 */
export interface AIVAQuestionConfig {
  version: string
  questions: AIVAQuestion[]
}

// =============================================================================
// RESPONSE TYPES
// =============================================================================

/**
 * Response to a single question
 */
export interface AIVAQuestionResponse {
  questionId: string
  questionType: AIVAQuestionType
  value: string | string[] // Single choice ID or array of checked IDs (for checklist)
}

/**
 * Inferred score for a dimension
 */
export interface AIVAInferredScore {
  score: number // 1-4 (can be decimal during aggregation, rounded for final)
  confidence: AIVAConfidence
  sources: string[] // Question IDs that contributed
}

/**
 * Full response submission from a single respondent
 */
export interface AIVAResponseSubmission {
  surveyInstanceId: string
  role: AIVARespondentRole
  responses: AIVAQuestionResponse[]
  durationSeconds?: number
}

/**
 * Stored response record (from aiva_responses table)
 */
export interface AIVAStoredResponse {
  id: string
  tenantId: string
  surveyInstanceId: string
  userId: string | null
  respondentRole: AIVARespondentRole
  responses: AIVAQuestionResponse[]
  inferredScores: Record<AIVADimension, AIVAInferredScore> | null
  startedAt: Date | null
  completedAt: Date | null
  durationSeconds: number | null
  createdAt: Date
  updatedAt: Date
}

// =============================================================================
// AGGREGATION TYPES
// =============================================================================

/**
 * Distribution statistics for a dimension across all respondents
 */
export interface AIVAScoreDistribution {
  min: number
  max: number
  mean: number
  median: number
  variance: number
  responseCount: number
  byRole: Record<AIVARespondentRole, number[]> // Scores per role
  roleMeans: Record<AIVARespondentRole, number | null>
  roleNormalizedMean: number | null
  sampleWeightedMean: number | null
}

/**
 * Aggregated scores before calibration
 */
export interface AIVAAggregatedScores {
  dimensions: Record<AIVADimension, AIVAScoreDistribution>
  participantCount: number
  rolesRepresented: Record<AIVARespondentRole, number>
}

/**
 * A calibration adjustment made by the scheduler
 */
export interface AIVACalibrationAdjustment {
  dimension: AIVADimension
  original: number // Aggregated mean
  final: number // Calibrated score (1-4)
  rationale: string // Required explanation
}

// =============================================================================
// ASSESSMENT TYPES (FINALIZED)
// =============================================================================

/**
 * Score with confidence for a single dimension
 */
export interface AIVADimensionScore {
  score: number // 1-4
  confidence: AIVAConfidence
}

/**
 * Finalized AIVA assessment (from aiva_assessments table)
 */
export interface AIVAAssessment {
  id: string
  tenantId: string
  scheduleId: string
  calibratedBy: string | null
  calibratedAt: Date | null
  participantCount: number
  rolesRepresented: Record<AIVARespondentRole, number>

  // All 34 dimension scores
  scores: Record<AIVADimension, AIVADimensionScore>

  // Calibration trail
  calibrationAdjustments: AIVACalibrationAdjustment[]

  // Aggregation details for transparency
  aggregationDetails: Record<AIVADimension, AIVAScoreDistribution>

  createdAt: Date
  updatedAt: Date
}

/**
 * Assessment preview (before calibration)
 */
export interface AIVAAssessmentPreview {
  scheduleId: string
  participantCount: number
  rolesRepresented: Record<AIVARespondentRole, number>
  scores: Record<
    AIVADimension,
    {
      mean: number
      median: number
      min: number
      max: number
      responseCount: number
      roleNormalizedMean: number | null
      sampleWeightedMean: number | null
      roleMeans: Record<AIVARespondentRole, number | null>
      variance: number
      byRole: Record<AIVARespondentRole, number[]>
    }
  >
  completionRate: number // % of assigned instances completed
}

// =============================================================================
// API TYPES
// =============================================================================

/**
 * Request to finalize an assessment with calibration
 */
export interface AIVAFinalizeRequest {
  adjustments: AIVACalibrationAdjustment[]
}

/**
 * Response from questions endpoint
 */
export interface AIVAQuestionsResponse {
  questions: AIVAQuestion[]
  totalCount: number
  roleCount: Record<AIVARespondentRole, number>
}

// =============================================================================
// RECOMMENDATION ENGINE TYPES (preserved from v1)
// =============================================================================

/**
 * Roadmap horizons for prioritized recommendations
 * - H1: 0-3 months - Unblock Flow (fix primary bottleneck)
 * - H2: 3-6 months - Enable Capabilities (address capability gaps)
 * - H3: 6-9 months - Build Foundations (platform and governance)
 * - H4: 9-12 months - Compound Acceleration (strategic investments)
 */
export type AIVARecommendationHorizon = 'H1' | 'H2' | 'H3' | 'H4'

/**
 * Effort level for implementing a recommendation
 */
export type AIVARecommendationEffort = 'low' | 'medium' | 'high'

/**
 * A single recommendation from the AIVA roadmap engine
 */
export interface AIVARecommendation {
  id: string
  horizon: AIVARecommendationHorizon
  title: string
  description: string
  targetCapability?: AIVACapabilityLayer
  targetPhase?: AIVAValueStreamPhase
  targetSubDimension?: AIVAValueStreamSubDimension
  dependencies: string[]
  successMetrics: string[]
  effort: AIVARecommendationEffort
  rationale: string
  priority?: number
}

/**
 * A capability gap identified during assessment analysis
 */
export interface AIVACapabilityGap {
  layer: AIVACapabilityLayer
  dimension: string
  score: number
  evidence?: string
}

/**
 * Full roadmap generated from an AIVA assessment
 */
export interface AIVARoadmap {
  assessmentId: string
  assessmentDate: string | null
  primaryBottleneck: AIVAValueStreamPhase | null
  recommendations: AIVARecommendation[]
  summary: {
    totalRecommendations: number
    byHorizon: Record<AIVARecommendationHorizon, number>
    byEffort: Record<AIVARecommendationEffort, number>
  }
  executiveSummary?: string
  source?: 'ai' | 'template'
  generatedAt?: string
}

/**
 * AI-generated roadmap stored alongside the assessment
 */
export interface AIVAGeneratedRoadmap {
  recommendations: AIVARecommendation[]
  executiveSummary: string
  primaryBottleneck: AIVAValueStreamPhase | null
  generatedAt: string
  model: string
  source: 'ai' | 'template'
}

// =============================================================================
// REPORT GENERATOR TYPES (preserved from v1)
// =============================================================================

/**
 * Value stream analysis section of the report
 */
export interface AIVAValueStreamAnalysis {
  scores: {
    discovery: number | null
    delivery: number | null
    validation: number | null
    foundations: number | null
  }
  subDimensionScores?: Partial<Record<AIVAValueStreamSubDimension, number | null>>
  averageScore: number | null
  bottleneck: AIVAValueStreamPhase | null
  analysis: string
}

/**
 * Capability analysis section of the report
 */
export interface AIVACapabilityAnalysis {
  byLayer: Record<
    AIVACapabilityLayer,
    {
      averageScore: number | null
      dimensions: Array<{ name: string; score: number | null }>
    }
  >
  topGaps: AIVACapabilityGap[]
  analysis: string
}

/**
 * Synthesis connecting bottlenecks to gaps
 */
export interface AIVASynthesis {
  bottleneckToGaps: string
  keyInsight: string
  priorityAreas: string[]
}

/**
 * Full diagnostic report from an AIVA assessment
 */
export interface AIVADiagnosticReport {
  metadata: {
    generatedAt: string
    assessmentId: string
    assessmentDate: string | null
    tenantName: string
  }
  executiveSummary: string
  valueStreamAnalysis: AIVAValueStreamAnalysis
  capabilityAnalysis: AIVACapabilityAnalysis
  synthesis: AIVASynthesis
  roadmap: AIVARecommendation[]
}

// =============================================================================
// AI FEEDBACK SUMMARY TYPES
// =============================================================================

/**
 * AI-generated summary for a single dimension's feedback
 */
export interface AIVADimensionFeedbackSummary {
  dimensionKey: AIVADimension
  summary: string // 2-3 sentence summary
  sentiment: 'positive' | 'mixed' | 'negative' | 'neutral'
  keyThemes: string[] // 2-4 bullet themes
}

/**
 * AI-generated feedback summaries for an assessment
 */
export interface AIVAFeedbackSummaries {
  executiveSummary: {
    overview: string // 2-3 sentence high-level summary
    startDoing: string[] // 3-5 concrete actions
    stopDoing: string[] // 2-4 items (only if clearly supported)
    majorThemes: string[] // 3-5 cross-cutting themes
  }
  dimensionSummaries: AIVADimensionFeedbackSummary[]
  generatedAt: string // ISO timestamp
  model: string // AI model used
  feedbackCount: number // Total responses summarized
}

// =============================================================================
// LEGACY COMPATIBILITY (for gradual migration)
// =============================================================================

/**
 * @deprecated Use AIVADimensionScore instead
 */
export interface AIVAScore {
  score: number
  confidence: AIVAConfidence
  evidence?: string
}

/**
 * @deprecated Use AIVAAssessment instead
 */
export type AIVAAssessmentType = 'value_stream' | 'capability' | 'full'
