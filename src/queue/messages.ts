// Queue message types for async processing

/**
 * Session processing queue message
 * Triggers session processing workflows
 */
export interface SessionProcessingMessage {
  sessionId: string
  tenantId: string
  userId: string
  provider: string
  forceReprocess?: boolean
  specificProcessor?: string
  enableAIModels?: boolean
  aiModelAdapter?: string
}

/**
 * Billing update queue message
 * Notifies billing system of quantity changes
 */
export interface BillingUpdateMessage {
  type: 'user_activated' | 'user_deactivated'
  tenantId: string
  userId: string
  username: string
  timestamp: string
}

/**
 * GitHub sync queue message
 * Triggers background GitHub synchronization
 */
export interface GitHubSyncMessage {
  syncLogId: string
  tenantId: string
  historyDepth: '7_days' | '30_days' | '90_days' | 'all'
  syncType: 'organisation' | 'full' | 'work_items'
}
