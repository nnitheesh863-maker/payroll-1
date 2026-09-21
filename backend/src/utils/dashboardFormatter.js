export const formatKpiMetrics = (kpi) => {
  return {
    ...kpi,
    formatted_payroll: '₹' + Number(kpi.total_payroll_last_month || 0).toLocaleString('en-IN'),
  };
};
