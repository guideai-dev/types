import type { User } from './domain/users.js'

// Auth context types

// Re-export User for backward compatibility
export type { User }

export interface AuthContext {
  tenantId: string
  permissions: string[]
  apiKey?: string
  userId?: string
  user?: User
}

/**
 * Subscription tier for per-team pricing (new model)
 * - free: 1 team limit (default)
 * - starter: 3 teams
 * - scaleUp: 10 teams
 * - enterprise: unlimited teams
 * - unlimited: admin-created special tier
 */
export type SubscriptionTier = 'free' | 'starter' | 'scaleUp' | 'enterprise' | 'unlimited'

export interface SubscriptionInfo {
  status: 'active' | 'canceled' | 'paused' | 'trialing' | 'past_due'
  isActive: boolean // true if status === 'active' || status === 'trialing'

  // NEW: Subscription tier (per-team pricing)
  tier?: SubscriptionTier
  teamLimit?: number | null // null = unlimited

  // DEPRECATED: Legacy plan names (kept for backward compatibility)
  plan?: 'individual' | 'smallTeam' | 'largeTeam' | 'enterprise'

  paddleCustomerId?: string
  paddleSubscriptionId?: string
  billingCycle?: string
}

export interface SessionContext {
  tenantId: string
  userId?: string
  permissions: string[]
  user?: User
  subscription?: SubscriptionInfo
  isSurveyOnly?: boolean
  tenantUser?: {
    role: 'owner' | 'admin' | 'member'
    tenantId: string
    userId: string
  }
  tenant?: {
    id: string
    name?: string | null
    slug?: string | null
  }
}
