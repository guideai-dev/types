/**
 * Jira webhook types
 * Types for Jira webhook registration, payloads, and management
 */

/**
 * Jira webhook event types
 * https://developer.atlassian.com/cloud/jira/platform/webhooks/
 */
export type JiraWebhookEvent = 'jira:issue_created' | 'jira:issue_updated' | 'jira:issue_deleted'

/**
 * Jira webhook registration request
 * POST /rest/api/3/webhook
 */
export interface JiraWebhookRegistrationRequest {
  url: string // Webhook URL to receive events
  webhooks: Array<{
    jqlFilter?: string // Optional JQL filter for targeted webhooks
    events: JiraWebhookEvent[] // Events to subscribe to
  }>
}

/**
 * Jira webhook registration response
 */
export interface JiraWebhookRegistrationResponse {
  webhookRegistrationResult: Array<{
    createdWebhookId?: number // Jira's webhook ID (present on success)
    errors?: string[] // Error messages (present on failure)
  }>
}

/**
 * Jira webhook details (from GET /rest/api/3/webhook)
 */
export interface JiraWebhook {
  id: number // Webhook ID
  jqlFilter?: string // JQL filter
  events: JiraWebhookEvent[] // Subscribed events
  expirationDate?: number // Expiration timestamp (Unix epoch ms)
}

/**
 * Jira webhook list response
 */
export interface JiraWebhookListResponse {
  maxResults: number
  startAt: number
  total: number
  isLast: boolean
  values: JiraWebhook[]
}

/**
 * Jira issue user
 */
export interface JiraIssueUser {
  accountId: string
  displayName: string
  emailAddress?: string
  avatarUrls?: {
    '16x16': string
    '24x24': string
    '32x32': string
    '48x48': string
  }
}

/**
 * Jira issue status
 */
export interface JiraIssueStatus {
  id: string
  name: string // 'To Do', 'In Progress', 'Done', etc.
  statusCategory: {
    id: number
    key: string // 'new', 'indeterminate', 'done'
    name: string
  }
}

/**
 * Jira issue type
 */
export interface JiraIssueType {
  id: string
  name: string // 'Bug', 'Task', 'Story', 'Epic', etc.
  subtask: boolean
  iconUrl: string
}

/**
 * Jira issue priority
 */
export interface JiraIssuePriority {
  id: string
  name: string // 'Highest', 'High', 'Medium', 'Low', 'Lowest'
  iconUrl: string
}

/**
 * Jira issue link type definition
 * Defines the relationship type between linked issues
 */
export interface JiraIssueLinkType {
  id: string
  name: string // 'Blocks', 'Relates', 'Duplicate', etc.
  inward: string // 'is blocked by', 'relates to', etc.
  outward: string // 'blocks', 'relates to', etc.
}

/**
 * Jira issue link
 * Represents a link between two issues
 */
export interface JiraIssueLink {
  id: string
  type: JiraIssueLinkType
  // One of these will be present depending on link direction
  inwardIssue?: {
    id: string
    key: string
    self: string
    fields?: {
      summary?: string
      status?: JiraIssueStatus
      issuetype?: JiraIssueType
    }
  }
  outwardIssue?: {
    id: string
    key: string
    self: string
    fields?: {
      summary?: string
      status?: JiraIssueStatus
      issuetype?: JiraIssueType
    }
  }
}

/**
 * Jira issue fields
 */
export interface JiraIssueFields {
  summary: string // Title
  description?: string | null // Description (may be ADF format)
  status: JiraIssueStatus
  issuetype: JiraIssueType
  priority?: JiraIssuePriority
  assignee?: JiraIssueUser | null
  reporter?: JiraIssueUser
  created: string // ISO 8601 timestamp
  updated: string // ISO 8601 timestamp
  labels?: string[]
  comment?: {
    total: number
  }
  // Issue links (for discovery validation and blocking relationships)
  issuelinks?: JiraIssueLink[]
  // Resolution date (when issue was resolved/closed)
  resolutiondate?: string | null // ISO 8601 timestamp
  // Agile fields (if available)
  customfield_10016?: number // Story points (field ID varies by instance)
  customfield_10020?: Array<{
    // Sprint (field ID varies by instance)
    id: number
    name: string
    state: string
  }>
  parent?: {
    // Epic link or parent issue
    id: string
    key: string
  }
}

/**
 * Jira issue (minimal representation)
 */
export interface JiraIssue {
  id: string // Issue ID
  key: string // Issue key (e.g., 'PROJ-123')
  self: string // API URL
  fields: JiraIssueFields
}

/**
 * Jira webhook changelog item
 */
export interface JiraWebhookChangelogItem {
  field: string // Field name (e.g., 'status', 'assignee')
  fieldtype: string // Field type (e.g., 'jira', 'custom')
  from: string | null // Old value ID
  fromString: string | null // Old value display text
  to: string | null // New value ID
  toString: string | null // New value display text
}

/**
 * Jira webhook changelog
 */
export interface JiraWebhookChangelog {
  id: string
  items: JiraWebhookChangelogItem[]
}

/**
 * Jira webhook payload (received on webhook URL)
 * https://developer.atlassian.com/cloud/jira/platform/webhooks/#understanding-the-webhook-payload
 */
export interface JiraWebhookPayload {
  timestamp: number // Unix timestamp (milliseconds)
  webhookEvent: JiraWebhookEvent // Event identifier
  issue_event_type_name?: string // Human-readable event type ('issue_created', etc.)
  user: JiraIssueUser // User who triggered the event
  issue: JiraIssue // Full issue object
  changelog?: JiraWebhookChangelog // Changed fields (for issue_updated)
  matchedWebhookIds?: number[] // Array of webhook IDs triggered by this event
}

/**
 * Webhook configuration stored in database
 * Extends webhookSecrets table schema
 */
export interface JiraWebhookConfig {
  id: string // UUID
  tenantId: string // Tenant UUID
  provider: 'jira'
  secret: string | null // Optional secret for validation (Jira doesn't sign webhooks)
  projectId?: string | null // Optional project scoping
  externalWebhookId: string // Jira webhook ID (as string)
  webhookUrl: string // Webhook receiver URL
  isActive: boolean
  cloudId: string // Jira cloud ID (site identifier)
  jqlFilter?: string | null // JQL filter for targeted webhooks
  events: JiraWebhookEvent[] // Subscribed events
  expiresAt?: Date | null // Webhook expiration (30 days from creation)
  createdAt: Date
  updatedAt: Date
}

/**
 * Connected Jira site (tenant-level installation)
 */
export interface JiraConnectedSite {
  id: string // Installation UUID
  cloudId: string // Jira cloud ID (site identifier)
  siteName: string // Site name (e.g., "Acme Corp")
  siteUrl: string // Site URL (e.g., "https://acmecorp.atlassian.net")
  isActive: boolean // Whether the installation is active (syncing enabled)
  createdAt: Date // When the site was connected
}

/**
 * Jira webhook settings API response
 */
export interface JiraWebhookSettingsResponse {
  isConnected: boolean // Tenant has at least one Jira site connected
  hasAdminScopes: boolean // Whether CURRENT USER has manage:jira-webhook scope
  webhooks: JiraWebhookConfig[]
  // Tenant-level connected sites (from jira_installations table)
  connectedSites: JiraConnectedSite[]
  // Sites accessible to the current user (only populated if userHasOAuth)
  accessibleResources: Array<{
    id: string // cloudId
    url: string // Site URL
    name: string // Site name
    avatarUrl: string
  }>
  // Whether the current user has personal Jira OAuth connected
  userHasOAuth: boolean
  // Re-authentication fields (when token is expired/invalid)
  needsReauth?: boolean // True if OAuth token expired and needs re-authentication
  reauthUrl?: string // URL to redirect user for re-authentication
  reauthMessage?: string // User-friendly message explaining why re-auth is needed
}

/**
 * Jira webhook registration request (API)
 */
export interface JiraWebhookCreateRequest {
  cloudId: string // Jira cloud ID
  siteUrl: string // Jira site URL (e.g., "https://guidemode.atlassian.net")
  events: JiraWebhookEvent[] // Events to subscribe to
  jqlFilter?: string // Optional JQL filter
}

/**
 * Jira webhook refresh request (API)
 */
export interface JiraWebhookRefreshRequest {
  webhookId: string // Internal webhook ID (UUID)
}

/**
 * Jira webhook delete request (API)
 */
export interface JiraWebhookDeleteRequest {
  webhookId: string // Internal webhook ID (UUID)
}
