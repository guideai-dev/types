/**
 * Provider session totals
 *
 * Some providers write a summary record into their transcript that is not a message:
 * Claude Code appends a `cost-state` line carrying authoritative per-model token counts
 * and the real dollar cost; Codex repeats a cumulative `total_token_usage` block.
 *
 * These records carry no `uuid`, `message` or `timestamp`, so the message parser drops
 * them by design — they are extracted separately and attached to the parsed session.
 */

/** Per-model token usage as the provider itself reports it. */
export interface ProviderModelUsage {
  /** Model id exactly as written, e.g. 'claude-opus-5[1m]'. Never normalised here. */
  model: string
  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
  webSearchRequests?: number
  /**
   * The provider's own cost for this model. Recorded as a cross-check only — the
   * headline figure is always derived from our own price table so that every provider
   * is measured the same way.
   */
  reportedCostUsd?: number
}

export interface ProviderSessionTotals {
  source: 'claude-cost-state' | 'codex-token-usage'
  /** Present only where the provider gives a per-model split (Claude does; Codex does not). */
  modelUsage?: ProviderModelUsage[]
  /** Session-wide totals, for providers that report only an aggregate. */
  totals?: {
    inputTokens: number
    outputTokens: number
    cacheCreationTokens: number
    cacheReadTokens: number
    reasoningTokens?: number
  }
  reportedCostUsd?: number
  /** The provider's own admission that it could not price part of the session. */
  hasUnknownModelCost?: boolean
  durations?: {
    apiMs?: number
    apiWithoutRetriesMs?: number
    toolMs?: number
    wallClockMs?: number
  }
  /**
   * Lines the agent itself wrote via edit/write tools. Deliberately NOT merged with the
   * `git*` line metrics, which measure a working-tree diff — different things.
   */
  agentLines?: { added: number; removed: number }
}
