// Actions that can be performed
export type Actions =
  | 'read' // View/list resources
  | 'manage' // Create, update, delete resources
  | 'access' // Feature-based access (future)

// Resources/subjects in the system
export type Subjects =
  | 'all' // Special: all resources
  // Tenant management (includes tenant-level administrative resources)
  | 'Tenant' // Tenant settings
  | 'TenantMember' // Tenant members
  | 'ApiKey' // API keys
  | 'GitHubApp' // GitHub app integrations
  // Session data
  | 'Session' // AI sessions
  | 'Analytics' // Analytics data
  // Teams
  | 'Team' // Teams
  | 'Repository' // Repositories
  | 'TeamTarget' // Team metric targets
  // Granular management
  | 'Integration' // Provider integrations (connect/sync/config)
  | 'Dashboard' // Dashboard CRUD
  | 'WorkTracking' // Label/status/env mappings, work tracking config
  | 'AIVA' // AIVA maturity assessments, interviews, roadmaps
  // Subscriber features (subscription-based access)
  | 'AdvancedAnalytics' // Advanced analytics features
  | 'UnlimitedSessions' // Unlimited session storage
  | 'GitHubIntegration' // GitHub integration access
  | 'TeamMembership' // Ability to add team members

import type { SubscriptionInfo } from './auth.js'

// CASL Ability type placeholder (actual type defined in server with @casl/ability)
// biome-ignore lint/suspicious/noExplicitAny: Placeholder for @casl/ability type, defined in consuming package
export type AppAbility = any

// Context passed to ability builder
export interface PermissionContext {
  user: {
    id: string
    isGlobalAdmin?: boolean
  }
  tenant?: {
    id: string
  }
  tenantUser?: {
    role: 'owner' | 'admin' | 'member' | 'support'
    tenantId: string
    userId: string
  }
  session?: {
    subscription?: SubscriptionInfo
  }
}
