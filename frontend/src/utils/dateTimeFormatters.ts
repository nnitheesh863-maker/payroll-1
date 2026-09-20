/**
 * Human-readable date formatting helper.
 */
export function formatDate(
  dateInput: string | Date | null | undefined,
  formatStyle: 'short' | 'medium' | 'long' = 'medium'
): string {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';

  const options: Intl.DateTimeFormatOptions = 
    formatStyle === 'short'
      ? { month: 'numeric', day: 'numeric', year: '2-digit' }
      : formatStyle === 'long'
      ? { month: 'long', day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' };

  return new Intl.DateTimeFormat('en-US', options).format(d);
}

/**
 * Returns human-friendly relative time string (e.g. '3 hours ago').
 */
export function formatRelativeTime(dateInput: string | Date): string {
  const d = new Date(dateInput);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)}d ago`;
  return formatDate(d, 'short');
}
