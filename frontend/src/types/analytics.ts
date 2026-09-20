export interface MetricCardData {
  title: string;
  value: string | number;
  changePercent?: number;
  isPositive?: boolean;
  period?: string;
  iconName?: string;
}

export interface PayrollSummaryChartData {
  month: string;
  grossPayout: number;
  netPayout: number;
  taxDeductions: number;
  employeeCount: number;
}
