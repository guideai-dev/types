/**
 * Issue types for work tracking
 * Provider-agnostic issue tracking for DORA metrics
 */

import type { Provider } from './repositories.js'

/**
 * Issue state
 */
export type IssueState = 'open' | 'closed' | 'in_progress'

/**
 * Issue type (internal categorization)
 */
export type IssueType = 'feature' | 'bug' | 'chore' | 'discovery' | 'incident' | 'other'

/**
 * A state transition event with timestamp
 * Used for tracking when issues move between states
 */
export interface StateTransition {
  fromState: IssueState | null
  toState: IssueState
  timestamp: Date
}

/**
 * Issue with full date tracking for analytics
 * Lead time = createdAt to closedAt
 * Cycle time = startedAt to closedAt
 */
export interface IssueWithDates {
  createdAt: Date
  startedAt: Date | null
  updatedAt: Date
  closedAt: Date | null
}

/**
 * Issue record from database
 */
export interface Issue {
  id: string
  tenantId: string
  repositoryId: string
  provider: Provider
  externalId: string
  number: number
  title: string
  body: string | null
  state: IssueState
  type: IssueType | null
  url: string
  apiUrl: string | null
  authorId: string | null
  authorExternalId: string | null
  authorUsername: string | null
  assigneeCount: number
  commentCount: number
  createdAt: Date
  startedAt: Date | null // When issue moved to in_progress state
  updatedAt: Date
  closedAt: Date | null
  firstResponseAt: Date | null
  metadata: Record<string, unknown> | null // Labels, milestone, etc.
  lastSyncedAt: Date
}

/**
 * Issue insert type
 */
export interface IssueInsert {
  tenantId: string
  repositoryId: string
  provider: Provider
  externalId: string
  number: number
  title: string
  body?: string | null
  state: IssueState
  type?: IssueType | null
  url: string
  apiUrl?: string | null
  authorId?: string | null
  authorExternalId?: string | null
  authorUsername?: string | null
  assigneeCount?: number
  commentCount?: number
  createdAt: Date
  startedAt?: Date | null
  updatedAt: Date
  closedAt?: Date | null
  firstResponseAt?: Date | null
  metadata?: Record<string, unknown> | null
}

/**
 * Issue update type
 */
export interface IssueUpdate {
  title?: string
  body?: string | null
  state?: IssueState
  type?: IssueType | null
  authorId?: string | null
  assigneeCount?: number
  commentCount?: number
  startedAt?: Date | null
  updatedAt?: Date
  closedAt?: Date | null
  firstResponseAt?: Date | null
  metadata?: Record<string, unknown> | null
  lastSyncedAt?: Date
}

/**
 * Issue API response
 */
export interface IssueResponse {
  id: string
  tenantId: string
  repositoryId: string
  provider: Provider
  externalId: string
  number: number
  title: string
  body: string | null
  state: IssueState
  type: IssueType | null
  url: string
  apiUrl: string | null
  author: {
    id: string | null
    externalId: string | null
    username: string | null
  }
  assigneeCount: number
  commentCount: number
  labels: IssueLabel[]
  createdAt: string
  startedAt: string | null
  updatedAt: string
  closedAt: string | null
  firstResponseAt: string | null
  leadTimeMs: number | null // Calculated: closedAt - createdAt
  cycleTimeMs: number | null // Calculated: closedAt - startedAt
  metadata: Record<string, unknown> | null
  lastSyncedAt: string
}

/**
 * Issue label
 */
export interface IssueLabel {
  id: string
  issueId: string
  name: string
  color: string | null
  description: string | null
  externalId: string | null
  createdAt: Date
}

/**
 * Issue label insert type
 */
export interface IssueLabelInsert {
  issueId: string
  name: string
  color?: string | null
  description?: string | null
  externalId?: string | null
}

/**
 * Issue filters for querying
 */
export interface IssueFilters {
  tenantId?: string
  repositoryId?: string
  provider?: Provider
  state?: IssueState
  type?: IssueType
  authorId?: string
  createdAfter?: Date
  createdBefore?: Date
  closedAfter?: Date
  closedBefore?: Date
  labels?: string[] // Filter by label names
  search?: string // Search by title
}

/**
 * Issue analytics metrics
 */
export interface IssueMetrics {
  totalCount: number
  openCount: number
  closedCount: number
  byType: Record<IssueType, number>
  averageLeadTimeMs: number | null // Time from created to closed
  medianLeadTimeMs: number | null
  averageCycleTimeMs: number | null // Time from started to closed
  medianCycleTimeMs: number | null
  averageFirstResponseMs: number | null
}
