/**
 * Issue link types for discovery validation tracking
 * Tracks relationships between issues (discovery → feature, blocks, etc.)
 */

import type { Provider } from './repositories.js'

/**
 * Issue link type
 */
export type IssueLinkType =
  | 'validates' // Discovery → Feature (discovery validated, feature created)
  | 'invalidates' // Discovery → closed (discovery disproved/rejected)
  | 'implements' // Feature implements Discovery (inverse of validates)
  | 'blocks' // Issue A blocks Issue B
  | 'blocked_by' // Issue A blocked by Issue B
  | 'relates_to' // General relationship
  | 'duplicates' // Issue A duplicates Issue B
  | 'duplicated_by' // Issue A duplicated by Issue B

/**
 * Link inference confidence level
 */
export type LinkInferenceConfidence = 'high' | 'medium' | 'low'

/**
 * Issue link record from database
 */
export interface IssueLink {
  id: string
  tenantId: string
  sourceIssueId: string
  targetIssueId: string | null // Nullable for unresolved cross-tool links
  linkType: IssueLinkType
  provider: Provider
  createdAt: Date
  // Cross-tool link fields
  targetExternalUrl?: string | null
  targetExternalId?: string | null
  targetProvider?: Provider | null
  isResolved: boolean
  inferenceConfidence?: LinkInferenceConfidence | null
}

/**
 * Issue link insert type
 */
export interface IssueLinkInsert {
  tenantId: string
  sourceIssueId: string
  targetIssueId?: string | null // Optional for cross-tool links
  linkType: IssueLinkType
  provider: Provider
  // Cross-tool link fields
  targetExternalUrl?: string
  targetExternalId?: string
  targetProvider?: Provider
  isResolved?: boolean
  inferenceConfidence?: LinkInferenceConfidence
}

/**
 * Cross-tool link insert (for creating unresolved links)
 */
export interface CrossToolLinkInsert {
  tenantId: string
  sourceIssueId: string
  linkType: IssueLinkType
  provider: Provider
  targetExternalUrl: string
  targetExternalId: string
  targetProvider: Provider
  inferenceConfidence?: LinkInferenceConfidence
}

/**
 * Issue link with related issue details
 */
export interface IssueLinkWithIssues {
  id: string
  tenantId: string
  linkType: IssueLinkType
  provider: Provider
  createdAt: Date
  sourceIssue: {
    id: string
    number: number
    title: string
    state: string
    type: string | null
  }
  targetIssue: {
    id: string
    number: number
    title: string
    state: string
    type: string | null
  }
}

/**
 * Issue link filters for querying
 */
export interface IssueLinkFilters {
  tenantId?: string
  sourceIssueId?: string
  targetIssueId?: string
  linkType?: IssueLinkType
  provider?: Provider
  createdAfter?: Date
  createdBefore?: Date
}

/**
 * Discovery validation metrics
 */
export interface DiscoveryMetrics {
  // Total counts
  totalDiscoveries: number
  closedDiscoveries: number
  openDiscoveries: number

  // Validation metrics
  validatedDiscoveries: number // Has 'validates' link to a feature
  invalidatedDiscoveries: number // Has 'invalidates' link or closed with no feature
  pendingDiscoveries: number // Open, no decision yet

  // Rates
  validationRate: number // % of closed discoveries that resulted in a feature
  discardRate: number // % of closed discoveries that were invalidated
  conversionTime: number | null // Average time from discovery creation to feature creation

  // Quality
  featuresFromDiscoveries: number // Count of features linked from discoveries
  discoveryQualityIndex: number // Success rate of discoveries leading to shipped features
}

/**
 * Issue link statistics
 */
export interface IssueLinkStats {
  byType: Record<IssueLinkType, number>
  byProvider: Record<Provider, number>
  totalLinks: number
}
