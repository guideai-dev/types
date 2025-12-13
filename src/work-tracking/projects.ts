/**
 * Project types for work tracking
 * Provider-agnostic project tracking for cross-repository initiatives
 */

/**
 * Project provider type
 */
export type ProjectProvider = 'github' | 'linear' | 'jira' | 'notion' | 'manual'

/**
 * Project status
 */
export type ProjectStatus = 'active' | 'completed' | 'archived'

/**
 * Project record from database
 */
export interface Project {
  id: string
  tenantId: string
  provider: ProjectProvider
  externalId: string | null
  name: string
  description: string | null
  url: string | null
  status: ProjectStatus

  // GitHub Projects v2 specific
  githubProjectNumber: number | null
  githubOrgLogin: string | null
  githubProjectId: string | null

  // Linear specific
  linearProjectId: string | null
  linearTeamId: string | null

  // Jira specific
  jiraProjectId: string | null
  jiraProjectKey: string | null
  jiraCloudId: string | null

  // Metadata
  startDate: Date | null
  targetDate: Date | null
  progressPercent: number | null
  syncEnabled: boolean
  lastSyncedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Project insert type
 */
export interface ProjectInsert {
  tenantId: string
  provider: ProjectProvider
  externalId?: string | null
  name: string
  description?: string | null
  url?: string | null
  status?: ProjectStatus

  // GitHub Projects v2 specific
  githubProjectNumber?: number | null
  githubOrgLogin?: string | null
  githubProjectId?: string | null

  // Linear specific
  linearProjectId?: string | null
  linearTeamId?: string | null

  // Jira specific
  jiraProjectId?: string | null
  jiraProjectKey?: string | null
  jiraCloudId?: string | null

  // Metadata
  startDate?: Date | null
  targetDate?: Date | null
  progressPercent?: number | null
  syncEnabled?: boolean
}

/**
 * Project update type
 */
export interface ProjectUpdate {
  name?: string
  description?: string | null
  url?: string | null
  status?: ProjectStatus
  startDate?: Date | null
  targetDate?: Date | null
  progressPercent?: number | null
  syncEnabled?: boolean
  lastSyncedAt?: Date | null
  updatedAt?: Date
}

/**
 * Project API response
 */
export interface ProjectResponse {
  id: string
  tenantId: string
  provider: ProjectProvider
  externalId: string | null
  name: string
  description: string | null
  url: string | null
  status: ProjectStatus

  // Provider-specific fields
  githubProjectNumber: number | null
  githubOrgLogin: string | null
  linearProjectId: string | null
  jiraProjectKey: string | null

  // Metadata
  startDate: string | null
  targetDate: string | null
  progressPercent: number | null
  syncEnabled: boolean
  lastSyncedAt: string | null
  createdAt: string
  updatedAt: string

  // Related counts (optional, populated when requested)
  issueCount?: number
  openIssueCount?: number
  closedIssueCount?: number
  repositoryCount?: number
}

/**
 * Project-Issue junction record
 */
export interface ProjectIssue {
  id: string
  projectId: string
  issueId: string
  position: number | null
  addedAt: Date
}

/**
 * Project-Issue insert type
 */
export interface ProjectIssueInsert {
  projectId: string
  issueId: string
  position?: number | null
}

/**
 * Project-Repository junction record
 */
export interface ProjectRepository {
  projectId: string
  repositoryId: string
  addedAt: Date
}

/**
 * Project-Repository insert type
 */
export interface ProjectRepositoryInsert {
  projectId: string
  repositoryId: string
}

/**
 * Team-Project junction record
 */
export interface TeamProject {
  teamId: string
  projectId: string
  addedAt: Date
}

/**
 * Team-Project insert type
 */
export interface TeamProjectInsert {
  teamId: string
  projectId: string
}

/**
 * Project filters for querying
 */
export interface ProjectFilters {
  tenantId?: string
  provider?: ProjectProvider
  status?: ProjectStatus
  teamId?: string
  repositoryId?: string
  search?: string // Search by name
  syncEnabled?: boolean
}

/**
 * Project with related data for detailed views
 */
export interface ProjectWithDetails extends ProjectResponse {
  issues: Array<{
    id: string
    number: number
    title: string
    state: string
    type: string | null
    position: number | null
  }>
  repositories: Array<{
    id: string
    name: string
    fullName: string | null
    provider: string | null
  }>
  teams: Array<{
    id: string
    name: string
    slug: string
  }>
}

/**
 * Project analytics metrics
 */
export interface ProjectMetrics {
  totalIssues: number
  openIssues: number
  closedIssues: number
  inProgressIssues: number
  byType: Record<string, number>
  repositoryCount: number
  teamCount: number
  completionRate: number | null // 0-100%
  averageCycleTimeMs: number | null
}
