import { calculateSalaryLines } from './payroll.service.js';

export const computeEmployeeBatch = (employees, contracts) => {
  return employees.map((emp) => {
    const contract = contracts.find((c) => c.employee_id === emp.id) || { wage: 75000 };
    const calc = calculateSalaryLines(contract.wage, 0, 30);
    return {
      employee: emp,
      calculation: calc,
    };
  });
};
