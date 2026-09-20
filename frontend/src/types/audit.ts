export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  timestamp: string;
  ip_address?: string;
  metadata?: Record<string, unknown>;
}
