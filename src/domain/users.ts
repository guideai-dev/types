// User and team member types

/**
 * User entity - represents a GuideMode user
 * Merges user definitions from auth and domain contexts
 */
export interface User {
  id: string
  githubId: number | null
  username: string
  email: string
  emailIsPlaceholder?: boolean
  name: string
  avatarUrl: string | null
  isGlobalAdmin?: boolean
  firstSessionUploadedAt?: Date | null
  createdAt?: string
  updatedAt?: string
}

/**
 * Tenant user association - links users to tenants with roles
 */
export interface TenantUser {
  tenantId: string
  userId: string
  role: 'owner' | 'admin' | 'member' | 'support'
  joinedAt: string
}

/**
 * Team member with user details - denormalized view for team management
 */
export interface TeamMember {
  id: string
  tenantId: string
  userId: string
  username: string
  name: string
  email: string
  emailIsPlaceholder?: boolean
  avatarUrl?: string
  role: 'owner' | 'admin' | 'member' | 'support'
  joinedAt: string
  firstSessionUploadedAt?: Date | null
  status: 'active' | 'pending'
}

/**
 * Team invitation request
 */
export interface InviteTeamMemberRequest {
  email: string
  role: 'admin' | 'member'
}

/**
 * Team invitation entity
 */
export interface TeamInvitation {
  id: string
  tenantId: string
  email: string
  role: 'admin' | 'member'
  invitedBy: string
  invitedAt: string
  expiresAt: string
  acceptedAt?: string
  status: 'pending' | 'accepted' | 'expired'
}

/**
 * Update team member role request
 */
export interface UpdateTeamMemberRoleRequest {
  userId: string
  role: 'owner' | 'admin' | 'member' | 'support'
}

/**
 * User deletion request
 */
export interface DeleteUserRequest {
  email: string
  confirm: string
}

/**
 * User deletion response
 */
export interface DeleteUserResponse {
  logout: boolean
}

/**
 * Home page focus preference for metrics display
 */
export type HomeFocusPreference = 'discovery' | 'delivery' | 'both'

/**
 * User settings - personal preferences and configuration
 * Generic structure matching tenant_settings for future extensibility
 */
export interface UserSettings {
  id: string
  userId: string
  emailSurveyAssignments: boolean
  emailSurveyReminders: boolean
  slackSurveyAssignments: boolean
  slackSurveyReminders: boolean
  homeFocusPreference: HomeFocusPreference
  createdAt: Date
  updatedAt: Date
}

/**
 * User settings update request
 */
export interface UserSettingsUpdate {
  emailSurveyAssignments?: boolean
  emailSurveyReminders?: boolean
  slackSurveyAssignments?: boolean
  slackSurveyReminders?: boolean
  homeFocusPreference?: HomeFocusPreference
}

/**
 * Get user settings response
 */
export interface GetUserSettingsResponse {
  settings: UserSettings
}

/**
 * Update user settings response
 */
export interface UpdateUserSettingsResponse {
  settings: UserSettings
}
