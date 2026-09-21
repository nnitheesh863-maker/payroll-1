export const calculateLopDeduction = (monthlySalary, lopDays, totalWorkingDays = 30) => {
  const dailyRate = Math.round((Number(monthlySalary) / totalWorkingDays) * 100) / 100;
  const totalDeduction = Math.round(dailyRate * Number(lopDays) * 100) / 100;
  return {
    dailyRate,
    lopDays: Number(lopDays),
    totalDeduction,
    adjustedGross: Math.max(0, monthlySalary - totalDeduction),
  };
};
