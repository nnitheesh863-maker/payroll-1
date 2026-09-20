export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  created_at: string;
  read: boolean;
  action_url?: string;
}
