import type { BaseMetrics } from './types.js'

/**
 * Quality metrics - measures task success, iteration count, and process quality
 */
export interface QualityMetrics extends BaseMetrics {
  task_success_rate: number
  iteration_count: number
  process_quality_score: number
  used_plan_mode: boolean
  used_todo_tracking: boolean
  over_top_affirmations: number
  metadata?: {
    successful_operations: number
    total_operations: number
    improvement_tips: string[]
    exit_plan_mode_count?: number
    todo_write_count?: number
    over_top_affirmations_phrases?: string[]
    /**
     * Version of the deterministic scorer that produced `process_quality_score`.
     * Scores from different versions are not comparable; group by this when trending.
     */
    process_quality_scorer_version?: string
    // Extra fields for detailed analysis
    cancellations?: number
    average_response_length?: number
  }
}
