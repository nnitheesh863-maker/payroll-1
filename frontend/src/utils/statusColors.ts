/**
 * Standard badge styling mapper for status strings.
 */
export function getStatusBadgeClasses(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'PAID':
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'PENDING':
    case 'PROCESSING':
    case 'DRAFT':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    case 'REJECTED':
    case 'CANCELLED':
    case 'TERMINATED':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}
