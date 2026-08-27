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
 * Respondent roles - each gets a tailored subset of questions.
 *
 * This tuple is the single source of truth for the role list. Derive from it
 * (and from `AIVARespondentRole`) rather than hand-writing role arrays or
 * zeroed per-role objects, so adding a role fails typecheck everywhere it
 * needs attention instead of silently defaulting.
 */
export const AIVA_RESPONDENT_ROLES = [
  'leadership',
  'product',
  'engineering',
  'architecture',
  'operations',
  'domainExpert',
] as const

export type AIVARespondentRole = (typeof AIVA_RESPONDENT_ROLES)[number]

/** Zeroed per-role counter — use instead of hand-written object literals. */
export function createEmptyRoleCounts(): Record<AIVARespondentRole, number> {
  return Object.fromEntries(AIVA_RESPONDENT_ROLES.map(role => [role, 0])) as Record<
    AIVARespondentRole,
    number
  >
}

/**
 * Survey variant selecting how many questions a respondent is asked.
 * - `full`: the complete question bank (default).
 * - `light`: a curated subset that still covers all 46 scored dimensions,
 *   faster to run at the cost of lower per-dimension statistical confidence.
 *   Uses the same questions/weights/scoring as `full`, so scorecards and all
 *   downstream tools work identically and remain comparable.
 */
export type AIVASurveyVariant = 'full' | 'light'

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
 * All dimensions organised by category.
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
  vsDiscoveryPrioritization: 'Prioritisation',
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
  aivaType:
    | 'scenario-choice'
    | 'frequency-scale'
    | 'evidence-checklist'
    | 'comparison-anchor'
    | 'open-feedback'

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
  adm?: number // Average Deviation from Median (scale points)
  consensus?: number // Tastle-Wierman [0,1], 1 = perfect agreement
  confidenceScore?: number // SEM-based precision [0,1], 1 = highest precision
  sem?: number // Standard Error of the Mean
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
  batchId: string | null
  calibratedBy: string | null
  calibratedAt: Date | null
  participantCount: number
  rolesRepresented: Record<AIVARespondentRole, number>
  /** Which survey variant produced this assessment (defaults to 'full' for legacy rows). */
  variant?: AIVASurveyVariant

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
      suggestedScore: number
      confidence: AIVAConfidence
      highVariance: boolean
      adm?: number
      consensus?: number
      confidenceScore?: number
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
 * Roadmap horizons for prioritised recommendations
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
  evidenceSources?: string[]
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
  priorityAnalysis?: AIVAPriorityAnalysis
  interviewTranscriptCount?: number
}

// =============================================================================
// INTERVIEW EVIDENCE AGGREGATION TYPES
// =============================================================================

/**
 * Aggregated dimension insight across all transcripts in a batch
 */
export interface AIVAAggregatedDimensionInsight {
  dimensionKey: string
  dimensionName: string
  mentionCount: number
  dominantSentiment: 'positive' | 'mixed' | 'negative' | 'neutral'
  strongestEvidence: 'strong' | 'moderate' | 'weak'
  themes: string[]
  summaries: string[]
}

/**
 * Aggregated discrepancy per dimension across all transcripts
 */
export interface AIVAAggregatedDiscrepancy {
  dimensionKey: string
  dimensionName: string
  transcriptCount: number
  dominantDirection: 'interview-higher' | 'interview-lower' | 'mixed' | 'aligned'
  maxSeverity: 'significant' | 'moderate' | 'none'
  avgSurveyScore: number
  dominantSentiment: 'positive' | 'mixed' | 'negative'
  summary: string
}

/**
 * Full aggregated interview evidence for a batch
 */
export interface AggregatedInterviewEvidence {
  transcriptCount: number
  dimensionInsights: AIVAAggregatedDimensionInsight[]
  discrepancies: AIVAAggregatedDiscrepancy[]
  keyThemes: string[]
}

/**
 * Output of the priority analysis step
 */
export interface AIVAPriorityAnalysis {
  priorities: AIVAPriorityItem[]
  discrepancyInsights: string[]
  interviewImpactSummary: string
}

/**
 * A single priority item from the priority analysis
 */
export interface AIVAPriorityItem {
  area: string
  areaName: string
  rationale: string
  evidenceSources: (
    | 'survey-score'
    | 'interview-insight'
    | 'discrepancy'
    | 'high-variance'
    | 'calibration'
  )[]
  suggestedHorizon: 'H1' | 'H2' | 'H3' | 'H4'
  confidence: 'high' | 'medium' | 'low'
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
// INTERVIEW TYPES
// =============================================================================

/**
 * Interview question (configured per-schedule)
 */
export interface AIVAInterviewQuestion {
  id: string
  text: string
  helpText?: string
  dimensionContributions: { dimension: AIVADimension; weight: number }[]
  order: number
}

/**
 * AI-generated summary per interview question
 */
export interface AIVAInterviewQuestionSummary {
  questionId: string
  questionText: string
  summary: string
  keyPoints: string[]
  relevantQuotes: string[]
  dimensions: string[]
}

/**
 * AI-generated insight per dimension from a transcript
 */
export interface AIVAInterviewDimensionInsight {
  dimensionKey: string
  summary: string
  sentiment: 'positive' | 'mixed' | 'negative' | 'neutral'
  keyThemes: string[]
  evidenceStrength: 'strong' | 'moderate' | 'weak'
  /** Participant user ID (set in batch-level collection for per-participant rows) */
  participantUserId?: string
  /** Participant display name (set in batch-level collection) */
  participantName?: string
}

/**
 * Comparison between interview qualitative insights and survey quantitative scores
 * for a single dimension
 */
export interface AIVAInterviewSurveyComparison {
  dimensionKey: string
  dimensionName: string
  interviewSentiment: 'positive' | 'mixed' | 'negative' | 'neutral'
  interviewEvidenceStrength: 'strong' | 'moderate' | 'weak'
  surveyScore: number
  surveyConfidence: 'low' | 'medium' | 'high'
  discrepancyDirection: 'interview-higher' | 'interview-lower' | 'aligned'
  discrepancySeverity: 'significant' | 'moderate' | 'none'
  summary: string
}

export type AIVAInterviewProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Full transcript record (API response shape)
 */
export interface AIVAInterviewTranscript {
  id: string
  tenantId: string
  scheduleId: string
  batchId: string | null
  participantUserId: string | null
  interviewerUserId: string | null
  title: string | null
  interviewerNames: string | null
  interviewDate: string | null
  processingStatus: AIVAInterviewProcessingStatus
  processingError?: string | null
  /** Raw transcript text - only included in detail endpoint, omitted from lists */
  rawTranscript?: string
  questionSummaries: AIVAInterviewQuestionSummary[] | null
  dimensionInsights: Record<string, AIVAInterviewDimensionInsight> | null
  surveyComparison: AIVAInterviewSurveyComparison[] | null
  createdAt: string
  updatedAt: string
  participantName?: string
  participantEmail?: string
  interviewerName?: string
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
  feedbackCount: number // Total responses summarised
  interviewInsights?: {
    transcriptCount: number
    dimensionInsights: AIVAInterviewDimensionInsight[]
    keyThemes: string[]
  }
}

// =============================================================================
// ROLE DISPLAY CONFIGURATION
// =============================================================================

/**
 * Configuration for how an AIVA role is displayed in the UI.
 * Tenants can override any of these fields per role.
 */
export interface AIVARoleDisplayConfig {
  label: string // Long name (e.g., "Product & Design")
  shortLabel: string // Short name for tables/charts (e.g., "Prod")
  description: string // Role description shown on selection card
  tags: string[] // Focus areas shown as chips
}

/**
 * Tenant-level overrides for role display names.
 * Partial at both levels: only override the roles and fields you want to change.
 */
export type AIVARoleDisplayOverrides = Partial<
  Record<AIVARespondentRole, Partial<AIVARoleDisplayConfig>>
>

/**
 * Built-in default display configuration for each AIVA role.
 */
export const AIVA_ROLE_DISPLAY_DEFAULTS: Record<AIVARespondentRole, AIVARoleDisplayConfig> = {
  leadership: {
    label: 'Leadership',
    shortLabel: 'Lead',
    description: 'Strategic oversight and organisational direction',
    tags: ['Strategic decisions', 'AI vision', 'Change management', 'Resource allocation'],
  },
  product: {
    label: 'Product & Design',
    shortLabel: 'Prod',
    description: 'Product discovery, UX design, and customer value delivery',
    tags: ['Discovery', 'UX/Design', 'Validation', 'Roadmap prioritisation'],
  },
  engineering: {
    label: 'Engineering',
    shortLabel: 'Eng',
    description: 'Technical implementation and platform capabilities',
    tags: ['Delivery', 'Technical platform', 'Tooling', 'CI/CD', 'Code quality'],
  },
  architecture: {
    label: 'Architecture',
    shortLabel: 'Arch',
    description: 'System design, technical standards, and cross-cutting governance',
    tags: ['Architecture', 'Standards', 'Security', 'Data Governance'],
  },
  operations: {
    label: 'Operations',
    shortLabel: 'Ops',
    description: 'Governance, compliance, and operational excellence',
    tags: ['SRE', 'Platform', 'Observability', 'Security', 'Operations'],
  },
  domainExpert: {
    label: 'Domain Expert',
    shortLabel: 'Dom',
    description:
      'Business-domain specialist involved in ideation, prioritisation and validation — not a day-to-day team member',
    tags: [
      'Domain knowledge',
      'Prioritisation',
      'User connection',
      'Acceptance testing',
      'Outcome validation',
    ],
  },
}

// =============================================================================
// LEGACY COMPATIBILITY (for gradual migration)
// =============================================================================

// =============================================================================
// DISPLAY NAME CONSTANTS
// =============================================================================

/**
 * Complete map of all dimension keys to display labels.
 * Combines VS parent phases + VS sub-dimensions + capability dimensions.
 * This is the canonical source of truth for all dimension display names.
 */
export const AIVA_DIMENSION_NAMES: Record<AIVADimension, string> = {
  vsDiscovery: 'Discovery',
  vsDelivery: 'Delivery',
  vsValidation: 'Validation',
  vsFoundations: 'Foundations',
  ...VS_SUB_DIMENSION_NAMES,
  capScLeadership: 'Leadership Commitment',
  capScAiVision: 'AI Vision',
  capScExperimentation: 'Experimentation Culture',
  capScLearning: 'Continuous Learning',
  capScChangeReadiness: 'Change Readiness',
  capPsAiFluency: 'AI Fluency',
  capPsPromptEngineering: 'Prompt Engineering',
  capPsGrowthFrameworks: 'Growth Frameworks',
  capPsRoleEvolution: 'Role Evolution',
  capPsTalentStrategy: 'Talent Strategy',
  capWowTeamTopology: 'Team Topology',
  capWowRituals: 'Rituals & Ceremonies',
  capWowDecisionMaking: 'Decision Making',
  capWowCrossFunctional: 'Cross-Functional Collaboration',
  capWowPrioritization: 'Prioritisation',
  capTpDesignSystem: 'Design System',
  capTpGoldenPaths: 'Golden Paths',
  capTpCiCd: 'CI/CD Pipeline',
  capTpAiTooling: 'AI Tooling',
  capTpObservability: 'Observability',
  capGeCompliance: 'Compliance',
  capGeSecurity: 'Security',
  capGeCostManagement: 'Cost Management',
  capGeQualityGates: 'Quality Gates',
  capGeDataGovernance: 'Data Governance',
  capEiStakeholderLiteracy: 'Stakeholder AI Literacy',
  capEiCustomerValidation: 'Customer Validation',
  capEiVendorAlignment: 'Vendor Alignment',
  capEiRegulatory: 'Regulatory Awareness',
  capEiDependencyManagement: 'Dependency Management',
}

/**
 * Human-readable descriptions for each scored dimension.
 * Used on the Scorecard overview page.
 */
export const AIVA_DIMENSION_DESCRIPTIONS: Record<AIVADimension, string> = {
  // Value Stream parent phases (computed)
  vsDiscovery:
    'How effectively your organisation discovers and validates customer problems before committing to solutions.',
  vsDelivery:
    'How efficiently your teams move from defined requirements through to shipped, working software.',
  vsValidation:
    'How well your organisation closes the loop — measuring outcomes, running experiments, and feeding evidence back into decisions.',
  vsFoundations:
    'The foundational capabilities that underpin delivery speed and quality: developer experience, knowledge sharing, observability, and governance.',

  // Discovery sub-dimensions
  vsDiscoveryResearch:
    'Ability to gather, synthesise, and act on user research, market signals, and competitive intelligence — including AI-assisted analysis.',
  vsDiscoveryClarity:
    'How clearly teams define the problem before jumping to solutions — hypothesis quality, requirement extraction, and spec rigour.',
  vsDiscoveryPrioritization:
    'Effectiveness of prioritisation frameworks: opportunity sizing, cost-of-delay thinking, and alignment between strategy and backlog.',
  vsDiscoveryCollaboration:
    'How well product, engineering, design, and stakeholders collaborate during the discovery phase to build shared understanding.',

  // Delivery sub-dimensions
  vsDeliveryVelocity:
    'Raw development throughput: cycle time from "in progress" to "done", including AI-assisted coding productivity gains.',
  vsDeliveryQuality:
    'Code review rigour, defect escape rate, and the consistency of quality standards — for both human and AI-generated code.',
  vsDeliveryRelease:
    'Deployment frequency, release automation maturity, and confidence in pushing changes to production safely.',
  vsDeliveryFlow:
    'Flow efficiency across the delivery pipeline: WIP limits, blocked work, handoff friction, and queue time between stages.',

  // Validation sub-dimensions
  vsValidationFeedback:
    'Speed and quality of feedback loops from production back to teams — user analytics, support signals, and operational telemetry.',
  vsValidationExperimentation:
    'Maturity of experimentation infrastructure: feature flags, A/B testing, canary releases, and the discipline to run controlled experiments.',
  vsValidationDecisions:
    'The degree to which product and engineering decisions are driven by evidence rather than opinion or authority.',
  vsValidationMetrics:
    'Clarity and consistency of outcome measurement: OKRs, success metrics per feature, and the ability to attribute impact.',

  // Foundations sub-dimensions
  vsFoundationsDx:
    'Developer experience quality: local dev setup time, build speeds, tooling ergonomics, and friction in the inner development loop.',
  vsFoundationsKnowledge:
    'How effectively knowledge is captured, shared, and discovered — onboarding speed, documentation quality, and institutional memory.',
  vsFoundationsObservability:
    'Depth of observability: structured logging, distributed tracing, alerting quality, and mean-time-to-diagnose when things go wrong.',
  vsFoundationsGovernance:
    'Governance that enables rather than blocks: lightweight approval processes, clear guardrails, and automated compliance checks.',

  // Capability: Strategy & Culture
  capScLeadership:
    'Visible executive sponsorship of AI adoption: budget allocation, strategic messaging, and willingness to invest in learning.',
  capScAiVision:
    "Clarity and communication of the organisation's AI vision — where AI fits in the SDLC and what success looks like.",
  capScExperimentation:
    'Cultural safety for experimentation: tolerance for failure, time allocated for exploration, and celebration of learning.',
  capScLearning:
    'Investment in continuous learning: training budgets, communities of practice, knowledge sharing rituals, and learning time.',
  capScChangeReadiness:
    'Organisational capacity to absorb change: communication effectiveness, change fatigue management, and adoption support.',

  // Capability: People & Skills
  capPsAiFluency:
    'Baseline AI literacy across the engineering organisation: understanding of capabilities, limitations, and appropriate use cases.',
  capPsPromptEngineering:
    'Skill in crafting effective prompts, context engineering, and working productively with AI coding assistants.',
  capPsGrowthFrameworks:
    'Maturity of career frameworks that account for AI-augmented roles: updated levelling criteria and skill progression paths.',
  capPsRoleEvolution:
    'How proactively roles are evolving to reflect AI capabilities — new responsibilities, changing expectations, and emerging specialisms.',
  capPsTalentStrategy:
    'Talent acquisition and retention strategy that accounts for AI skills: hiring criteria, employer branding, and competitive positioning.',

  // Capability: Ways of Working
  capWowTeamTopology:
    'Team structure alignment with value streams: team size, cognitive load, and clear ownership boundaries.',
  capWowRituals:
    'Effectiveness of team rituals: standups, retrospectives, planning sessions — and how they incorporate AI-generated insights.',
  capWowDecisionMaking:
    'Decision-making speed and quality: clear authority, appropriate escalation, and evidence-informed choices.',
  capWowCrossFunctional:
    'Collaboration across team boundaries: dependency management, shared goals, and friction in cross-team work.',
  capWowPrioritization:
    'Team-level prioritisation discipline: backlog hygiene, WIP limits, and alignment between team priorities and strategy.',

  // Capability: Technical Platform
  capTpDesignSystem:
    'Maturity of shared design systems and component libraries: consistency, adoption, and contribution model.',
  capTpGoldenPaths:
    'Availability of blessed paths for common tasks: starter templates, reference implementations, and reusable modules.',
  capTpCiCd:
    'CI/CD pipeline maturity: build reliability, deployment automation, rollback capability, and pipeline-as-code adoption.',
  capTpAiTooling:
    'Quality and governance of AI development tools: approved tools, configuration standards, and shadow IT management.',
  capTpObservability:
    'Platform-level observability: APM, infrastructure monitoring, cost dashboards, and self-service debugging tools.',

  // Capability: Governance & Enablers
  capGeCompliance:
    'AI compliance posture: acceptable use policies, regulatory alignment (NIST AI RMF, ISO 42001), and audit readiness.',
  capGeSecurity:
    'Security practices for AI-augmented development: least-privilege for AI tools, prompt injection defenses, and credential management.',
  capGeCostManagement:
    'Visibility and control of AI and infrastructure costs: per-team budgets, cost-per-value metrics, and alerting thresholds.',
  capGeQualityGates:
    'Automated quality gates in the pipeline: security scanning, test coverage thresholds, and AI-specific checks.',
  capGeDataGovernance:
    'Data governance for AI systems: classification, access controls, PII handling, and RAG pipeline data quality.',

  // Capability: External Interfaces
  capEiStakeholderLiteracy:
    'Stakeholder understanding of AI capabilities and limitations: realistic expectations, informed decision-making, and constructive feedback.',
  capEiCustomerValidation:
    'Maturity of customer validation processes: user testing, feedback collection, and how AI insights are incorporated.',
  capEiVendorAlignment:
    'Strategic alignment with AI tool vendors: evaluation frameworks, contract terms, and migration planning.',
  capEiRegulatory:
    'Awareness and readiness for AI regulation: monitoring regulatory developments, compliance planning, and risk assessment.',
  capEiDependencyManagement:
    'Management of external dependencies: third-party risk assessment, supply chain security, and vendor lock-in mitigation.',
}

/**
 * Descriptions for the two top-level scorecard areas
 */
export const AIVA_SCORECARD_AREA_DESCRIPTIONS = {
  valueStream:
    'Measures how effectively work flows through the full product lifecycle — from discovering the right problems to delivering and validating solutions. Each phase represents a stage of the double diamond, assessed through four sub-dimensions.',
  capabilityMaturity:
    'Assesses the organisational capabilities that underpin delivery effectiveness. Six layers cover everything from leadership commitment and team skills through to platform maturity and external governance.',
} as const

/**
 * Descriptions for value stream phases
 */
export const AIVA_VALUE_STREAM_PHASE_DESCRIPTIONS: Record<AIVAValueStreamPhase, string> = {
  discovery:
    'The first diamond — understanding the problem space through research, clear definition, smart prioritisation, and cross-functional collaboration.',
  delivery:
    'The second diamond — turning validated problems into shipped software through development speed, quality standards, release capability, and flow efficiency.',
  validation:
    'Closing the loop — measuring what matters through feedback loops, experimentation, evidence-based decisions, and outcome tracking.',
  foundations:
    'The enablers that make everything else possible — developer experience, knowledge management, observability, and enabling governance.',
}

/**
 * Descriptions for capability layers
 */
export const AIVA_CAPABILITY_LAYER_DESCRIPTIONS: Record<AIVACapabilityLayer, string> = {
  strategyAndCulture:
    'Leadership commitment, AI vision clarity, experimentation culture, and organisational readiness for change.',
  peopleAndSkills:
    'AI literacy, prompt engineering capability, career frameworks for AI-augmented roles, and talent strategy.',
  waysOfWorking:
    'Team structures, rituals, decision-making, cross-functional collaboration, and prioritisation discipline.',
  technicalPlatform:
    'Design systems, golden paths, CI/CD maturity, AI tooling governance, and platform observability.',
  governanceAndEnablers:
    'Compliance, security, cost management, automated quality gates, and data governance for AI systems.',
  externalInterfaces:
    'Stakeholder literacy, customer validation, vendor alignment, regulatory readiness, and dependency management.',
}

/**
 * Full display names for capability layers
 */
export const AIVA_CAPABILITY_LAYER_NAMES: Record<AIVACapabilityLayer, string> = {
  strategyAndCulture: 'Strategy & Culture',
  peopleAndSkills: 'People & Skills',
  waysOfWorking: 'Ways of Working',
  technicalPlatform: 'Platform',
  governanceAndEnablers: 'Governance & Enablers',
  externalInterfaces: 'External Interfaces',
}

/**
 * Compact display names for capability layers (for charts/badges)
 */
export const AIVA_CAPABILITY_LAYER_SHORT_NAMES: Record<AIVACapabilityLayer, string> = {
  strategyAndCulture: 'Strategy & Culture',
  peopleAndSkills: 'People & Skills',
  waysOfWorking: 'Ways of Working',
  technicalPlatform: 'Platform',
  governanceAndEnablers: 'Governance',
  externalInterfaces: 'External',
}

/**
 * Display names for value stream phases
 */
export const AIVA_VALUE_STREAM_PHASE_NAMES: Record<AIVAValueStreamPhase, string> = {
  discovery: 'Discovery',
  delivery: 'Delivery',
  validation: 'Validation',
  foundations: 'Foundations',
}

/**
 * Display labels for respondent roles
 */
export const AIVA_ROLE_LABELS: Record<AIVARespondentRole, string> = {
  leadership: 'Leadership',
  product: 'Product',
  engineering: 'Engineering',
  architecture: 'Architecture',
  operations: 'Operations',
  domainExpert: 'Domain Expert',
}

/**
 * Short display labels for respondent roles (for table headers, charts)
 */
export const AIVA_ROLE_SHORT_LABELS: Record<AIVARespondentRole, string> = {
  leadership: 'Lead',
  product: 'Prod',
  engineering: 'Eng',
  architecture: 'Arch',
  operations: 'Ops',
  domainExpert: 'Dom',
}

/**
 * Maps each capability layer to its dimension keys (derived from AIVA_DIMENSIONS)
 */
export const AIVA_CAPABILITY_DIMENSION_KEYS: Record<AIVACapabilityLayer, readonly AIVADimension[]> =
  {
    strategyAndCulture: AIVA_DIMENSIONS.strategyAndCulture,
    peopleAndSkills: AIVA_DIMENSIONS.peopleAndSkills,
    waysOfWorking: AIVA_DIMENSIONS.waysOfWorking,
    technicalPlatform: AIVA_DIMENSIONS.technicalPlatform,
    governanceAndEnablers: AIVA_DIMENSIONS.governanceAndEnablers,
    externalInterfaces: AIVA_DIMENSIONS.externalInterfaces,
  }

/**
 * Maps each VS phase to its parent dimension key
 */
export const AIVA_VS_PHASE_DIMENSION_KEYS: Record<AIVAValueStreamPhase, AIVADimension> = {
  discovery: 'vsDiscovery',
  delivery: 'vsDelivery',
  validation: 'vsValidation',
  foundations: 'vsFoundations',
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
