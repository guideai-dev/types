import type { BaseMetrics } from './types.js'

/**
 * Per-model token usage for one session.
 *
 * `model` is stored exactly as the provider wrote it, including any context-tier suffix
 * such as `claude-opus-5[1m]`. Normalising it is the pricing layer's job — a tier suffix
 * changes the rate, so collapsing it here would silently mis-price the session.
 */
export interface SessionModelUsage {
  model: string
  input_tokens: number
  output_tokens: number
  cache_creation_tokens: number
  /**
   * Portion of `cache_creation_tokens` written with a 1-hour TTL, which Anthropic bills
   * at a higher rate than the 5-minute default. Optional because it is only ever known
   * for providers that report the breakdown, and absent on every session ingested before
   * it was captured — those price the whole cache write at the base rate.
   *
   * Always <= `cache_creation_tokens`, and deliberately an UNDER-count where the
   * provider's summary record covers requests the transcript does not. See
   * `token-attribution.ts`: the derived cost is a floor, never an over-charge.
   */
  cache_creation_1h_tokens?: number
  cache_read_tokens: number
  reasoning_tokens: number
  web_search_requests?: number
  /** The provider's own cost for this model, where it reports one. Cross-check only. */
  reported_cost_usd?: number
}

/**
 * Token and cost metrics for a session.
 *
 * The headline cost is always DERIVED from our own price table so that every provider is
 * measured identically; the provider's own figure is carried alongside purely as a
 * cross-check. Derived cost is filled in by the server after these metrics are stored,
 * since pricing needs database access this package does not have.
 */
export interface TokenCostMetrics extends BaseMetrics {
  /** 'provider_totals' | 'mixed' | 'message_usage' — see token attribution. */
  token_attribution_source: string
  model_usage: SessionModelUsage[]
  primary_model: string | null
  distinct_model_count: number
  total_reasoning_tokens: number
  /** Requests whose usage appeared on several lines and was counted once. Diagnostic. */
  duplicate_request_count: number

  /** Provider-reported cost. Never the headline. */
  provider_reported_cost_usd?: number
  provider_reported_source?: string
  /** The provider's own admission that it could not price part of the session. */
  provider_has_unknown_model_cost?: boolean

  api_duration_ms?: number
  api_duration_without_retries_ms?: number
  tool_duration_ms?: number
  agent_wall_clock_ms?: number

  /**
   * Lines written by the agent's edit/write tools. Distinct from the `git_*` line
   * metrics, which measure a working-tree diff.
   */
  agent_lines_added?: number
  agent_lines_removed?: number
  web_search_requests?: number
}
