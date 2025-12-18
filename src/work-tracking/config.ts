/**
 * Configuration types for work tracking
 * Label mappings, environment mappings, status mappings, webhook secrets
 */

import type { IssueType, SubStatus } from './issues.js'
import type { Provider } from './repositories.js'

/**
 * Label mapping
 * Maps external provider labels to internal issue types
 */
export interface LabelMapping {
  id: string
  tenantId: string
  provider: Provider
  externalLabel: string
  internalType: IssueType
  repositoryId: string | null // null = applies to all repos
  createdAt: Date
  updatedAt: Date
}

/**
 * Label mapping insert type
 */
export interface LabelMappingInsert {
  tenantId: string
  provider: Provider
  externalLabel: string
  internalType: IssueType
  repositoryId?: string | null
}

/**
 * Label mapping update type
 */
export interface LabelMappingUpdate {
  externalLabel?: string
  internalType?: IssueType
  repositoryId?: string | null
  updatedAt?: Date
}

/**
 * Environment mapping
 * Maps environment names to production status
 */
export interface EnvironmentMapping {
  id: string
  tenantId: string
  provider: Provider
  environmentPattern: string // Supports wildcards like "prod*"
  isProduction: 'true' | 'false'
  repositoryId: string | null // null = applies to all repos
  createdAt: Date
  updatedAt: Date
}

/**
 * Environment mapping insert type
 */
export interface EnvironmentMappingInsert {
  tenantId: string
  provider: Provider
  environmentPattern: string
  isProduction: 'true' | 'false'
  repositoryId?: string | null
}

/**
 * Environment mapping update type
 */
export interface EnvironmentMappingUpdate {
  environmentPattern?: string
  isProduction?: 'true' | 'false'
  repositoryId?: string | null
  updatedAt?: Date
}

/**
 * Status mapping
 * Maps external provider statuses to internal sub-status categories
 * Supports global defaults and project/repository-level overrides
 */
export interface StatusMapping {
  id: string
  tenantId: string
  provider: Provider
  externalStatus: string // Provider's status string
  internalSubStatus: SubStatus
  projectId: string | null // null = applies to all projects
  repositoryId: string | null // null = applies to all repos
  createdAt: Date
  updatedAt: Date
}

/**
 * Status mapping insert type
 */
export interface StatusMappingInsert {
  tenantId: string
  provider: Provider
  externalStatus: string
  internalSubStatus: SubStatus
  projectId?: string | null
  repositoryId?: string | null
}

/**
 * Status mapping update type
 */
export interface StatusMappingUpdate {
  externalStatus?: string
  internalSubStatus?: SubStatus
  projectId?: string | null
  repositoryId?: string | null
  updatedAt?: Date
}

/**
 * Webhook secret
 * Stores webhook secrets for validating incoming webhooks
 */
export interface WebhookSecret {
  id: string
  tenantId: string
  provider: Provider
  secret: string // Encrypted/hashed
  repositoryId: string | null // null = applies to all repos
  externalWebhookId: string | null
  webhookUrl: string | null
  isActive: 'true' | 'false'
  createdAt: Date
  updatedAt: Date
}

/**
 * Webhook secret insert type
 */
export interface WebhookSecretInsert {
  tenantId: string
  provider: Provider
  secret: string
  repositoryId?: string | null
  externalWebhookId?: string | null
  webhookUrl?: string | null
  isActive?: 'true' | 'false'
}

/**
 * Webhook secret update type
 */
export interface WebhookSecretUpdate {
  secret?: string
  externalWebhookId?: string | null
  webhookUrl?: string | null
  isActive?: 'true' | 'false'
  updatedAt?: Date
}

/**
 * Pull request to session link
 */
export interface PullRequestSessionLink {
  id: string
  tenantId: string
  pullRequestId: string
  sessionId: string // Links to agent_sessions.sessionId
  sessionFileId: string | null // Optional link to specific file
  linkMethod: string // branch_match, manual, pr_comment
  confidence: string | null // high, medium, low
  createdAt: Date
  updatedAt: Date
}

/**
 * PR-session link insert type
 */
export interface PullRequestSessionLinkInsert {
  tenantId: string
  pullRequestId: string
  sessionId: string
  sessionFileId?: string | null
  linkMethod?: string
  confidence?: string | null
}

/**
 * PR-session link update type
 */
export interface PullRequestSessionLinkUpdate {
  linkMethod?: string
  confidence?: string | null
  updatedAt?: Date
}
