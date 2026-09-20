export const DEPARTMENTS = [
  'Engineering',
  'Product & Design',
  'Human Resources',
  'Finance & Accounting',
  'Sales & Marketing',
  'Legal & Compliance',
  'Customer Operations'
] as const;

export type DepartmentType = typeof DEPARTMENTS[number];
