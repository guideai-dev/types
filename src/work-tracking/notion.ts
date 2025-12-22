/**
 * Notion integration types
 * Types for Notion workspace installations, database mappings, and sync operations
 */

/**
 * SubStatus values for Notion (matches status-sub-status-inference.ts)
 */
export type NotionSubStatus =
  | 'backlog'
  | 'ready'
  | 'discovery'
  | 'delivery'
  | 'review'
  | 'blocked'
  | 'parked'
  | 'done'
  | 'canceled'

/**
 * User relation types that can be mapped to Notion people properties
 */
export type NotionUserRelationType = 'author' | 'assignee' | 'commenter' | 'mentioned'

/**
 * User mapping configuration - maps a Notion people property to a relation type
 */
export interface NotionUserMapping {
  /** Name of the Notion property (must be 'people' or 'created_by' type) */
  notionProperty: string
  /** Type of the Notion property */
  notionPropertyType: 'people' | 'created_by'
  /** The relation type to assign to users from this property */
  relationType: NotionUserRelationType
}

/**
 * SubStatus mapping configuration for Notion
 * Maps Notion status/select values to internal subStatus values
 */
export interface NotionSubStatusMapping {
  /** Name of the Notion property to read status from */
  notionProperty: string
  /** Type of the Notion property (must be 'status' or 'select') */
  notionPropertyType: 'status' | 'select'
  /** Maps Notion status values to internal subStatus values */
  valueMappings: Record<string, NotionSubStatus>
}

/**
 * Notion workspace installation - one per tenant
 */
export interface NotionInstallation {
  id: string
  tenantId: string
  notionWorkspaceId: string
  notionWorkspaceName: string
  notionWorkspaceIcon: string | null
  botId: string
  webhookSecret: string | null
  installedByUserId: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Notion installation response (API)
 */
export interface NotionInstallationResponse {
  id: string
  tenantId: string
  notionWorkspaceId: string
  notionWorkspaceName: string
  notionWorkspaceIcon: string | null
  databaseCount: number
  syncEnabledCount: number
  createdAt: string
  updatedAt: string
}

/**
 * Notion database mapping - column-to-field configuration per database
 */
export interface NotionDatabaseMapping {
  id: string
  tenantId: string
  notionInstallationId: string
  notionDatabaseId: string
  notionDatabaseName: string
  notionDatabaseIcon: string | null
  repositoryId: string | null
  mappingConfig: NotionMappingConfig | null
  syncEnabled: boolean
  lastSyncedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Property mapping for a single Issue field
 */
export interface NotionPropertyMapping {
  /** Name of the Notion property to read */
  notionProperty: string
  /** Type of the Notion property (title, rich_text, select, status, date, etc.) */
  notionPropertyType: string
  /** Whether this mapping is optional */
  optional?: boolean
  /** For status/select: maps Notion values to Issue values */
  mappings?: Record<string, string>
  /** For createdAt: use Notion's built-in created_time */
  useNotionCreated?: boolean
}

/**
 * Team value mapping - maps a Notion multi-select value to an existing or new team
 */
export interface NotionTeamValueMapping {
  /** The multi-select option name from Notion */
  notionValue: string
  /** Existing team ID to map to (null = auto-create new team) */
  teamId: string | null
  /** Whether this team was auto-created during sync */
  autoCreated?: boolean
}

/**
 * Team mapping configuration for Notion database
 */
export interface NotionTeamMapping {
  /** Name of the Notion multi-select property */
  notionProperty: string
  /** Must be multi_select */
  notionPropertyType: 'multi_select'
  /** Mappings from Notion values to teams */
  valueMappings: NotionTeamValueMapping[]
}

/**
 * Configuration for a delivery link property mapping
 * Maps a Notion property (relation or URL) to cross-tool issue links
 */
export interface NotionDeliveryLinkMapping {
  /** Name of the Notion property */
  notionProperty: string
  /** Type of the property: 'relation' or 'url' */
  notionPropertyType: 'relation' | 'url'
  /** The type of link to create */
  linkType: 'validates' | 'implements' | 'relates_to'
}

/**
 * Complete mapping configuration for a Notion database
 */
export interface NotionMappingConfig {
  /** Required: maps to Issue.title */
  title: NotionPropertyMapping
  /** Optional: maps to Issue.body */
  body?: NotionPropertyMapping
  /**
   * @deprecated Use subStatus instead. State is automatically derived from subStatus.
   * Maps to Issue.state (open/closed/in_progress)
   */
  state?: NotionPropertyMapping
  /** Maps Notion status values to subStatus. State is automatically derived. */
  subStatus?: NotionSubStatusMapping
  /** Required for sync: maps to Issue.type (feature/bug/chore/discovery/incident/other) */
  type?: NotionPropertyMapping
  /** Required for sync: maps to team assignment */
  team?: NotionTeamMapping
  /** Optional: maps to Issue.createdAt */
  createdAt?: NotionPropertyMapping
  /** Optional: maps to Issue.closedAt */
  closedAt?: NotionPropertyMapping
  /**
   * @deprecated Use userMappings instead for flexible user relation mapping.
   * Maps to Issue.authorUsername (people or created_by property)
   */
  creator?: NotionPropertyMapping
  /**
   * @deprecated Use userMappings instead for flexible user relation mapping.
   * Maps to Issue.assigneeUsername (people property)
   */
  assignee?: NotionPropertyMapping
  /** Dynamic user mappings - maps Notion people properties to user relation types */
  userMappings?: NotionUserMapping[]
  /** Optional: maps Notion relation/URL properties to cross-tool issue links */
  deliveryLinks?: NotionDeliveryLinkMapping[]
}

/**
 * Validation result for Notion mapping configuration
 */
export interface NotionMappingValidationResult {
  /** Whether the mapping is valid for sync */
  valid: boolean
  /** List of missing required fields */
  missingFields: string[]
  /** Guidance messages for the user */
  guidance: string[]
  /** Whether sync can be enabled */
  canEnableSync: boolean
}

/**
 * Notion sync log entry
 */
export interface NotionSyncLog {
  id: string
  tenantId: string
  notionWorkspaceId: string
  notionWorkspaceName: string
  syncType: NotionSyncType
  status: NotionSyncStatus
  startedAt: Date
  completedAt: Date | null
  stats: NotionSyncStats | null
  currentStep: string | null
  errorMessage: string | null
  createdAt: Date
}

export type NotionSyncType = 'full' | 'databases' | 'issues'

export type NotionSyncStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'

export interface NotionSyncStats {
  databasesProcessed: number
  issuesCreated: number
  issuesUpdated: number
  issuesDeleted?: number
  errors?: number
}

/**
 * Notion database info from API
 */
export interface NotionDatabaseInfo {
  id: string
  name: string
  icon: string | null
  url: string
  properties: NotionPropertyInfo[]
  lastEditedTime: string
}

/**
 * Notion property info from database schema
 */
export interface NotionPropertyInfo {
  id: string
  name: string
  type: NotionPropertyType
  /** For select/multi_select: available options */
  options?: NotionSelectOption[]
  /** For status: available status groups and options */
  groups?: NotionStatusGroup[]
}

export type NotionPropertyType =
  | 'title'
  | 'rich_text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'status'
  | 'date'
  | 'people'
  | 'files'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by'

export interface NotionSelectOption {
  id: string
  name: string
  color: string
}

export interface NotionStatusGroup {
  id: string
  name: string
  color: string
  options: NotionSelectOption[]
}

/**
 * API request/response types
 */
export interface SaveNotionMappingRequest {
  mappingConfig: NotionMappingConfig
  syncEnabled?: boolean
}

export interface NotionDatabaseMappingResponse {
  id: string
  notionDatabaseId: string
  notionDatabaseName: string
  notionDatabaseIcon: string | null
  mappingConfig: NotionMappingConfig | null
  syncEnabled: boolean
  lastSyncedAt: string | null
}

export interface TriggerNotionSyncRequest {
  syncType: NotionSyncType
}

export interface NotionSyncLogResponse {
  id: string
  syncType: NotionSyncType
  status: NotionSyncStatus
  startedAt: string
  completedAt: string | null
  stats: NotionSyncStats | null
  currentStep: string | null
  errorMessage: string | null
}
