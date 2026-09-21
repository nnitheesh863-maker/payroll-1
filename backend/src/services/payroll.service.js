import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';

export const calculateSalaryLines = (grossSalary, lopDays = 0, workingDays = 30) => {
  const wage = Number(grossSalary) || 0;
  const basic = Math.round(wage * 0.50);
  const hra = Math.round(wage * 0.25);
  const conveyance = Math.round(wage * 0.10);
  const specialAllowance = Math.round(wage * 0.15);

  const dailyRate = Math.round((wage / (workingDays || 30)) * 100) / 100;
  const lopDeduction = Math.round(lopDays * dailyRate * 100) / 100;

  // Deductions
  const pf = Math.round(basic * 0.12);
  const tds = Math.round(wage * 0.065);
  const totalDeductions = pf + tds + lopDeduction;

  const totalEarnings = wage;
  const netSalary = Math.max(0, totalEarnings - totalDeductions);

  const lines = [
    { code: 'BASIC', name: 'Basic Salary', category: 'BASIC', rate: 50.0, amount: basic },
    { code: 'HRA', name: 'House Rent Allowance', category: 'ALLOWANCE', rate: 25.0, amount: hra },
    { code: 'CONV', name: 'Conveyance Allowance', category: 'ALLOWANCE', rate: 10.0, amount: conveyance },
    { code: 'SPECIAL', name: 'Special Allowance', category: 'ALLOWANCE', rate: 15.0, amount: specialAllowance },
    { code: 'PF', name: 'Provident Fund (12%)', category: 'DEDUCTION', rate: 12.0, amount: pf },
    { code: 'TDS', name: 'Income Tax TDS (6.5%)', category: 'DEDUCTION', rate: 6.5, amount: tds },
  ];

  if (lopDeduction > 0) {
    lines.push({
      code: 'LOP',
      name: `Loss of Pay (${lopDays} days)`,
      category: 'DEDUCTION',
      rate: 0,
      amount: lopDeduction,
    });
  }

  return {
    basic_salary: basic,
    gross_salary: totalEarnings,
    total_deductions: totalDeductions,
    net_salary: netSalary,
    lop_days: lopDays,
    lop_deduction: lopDeduction,
    lines,
  };
};

export const samplePayruns = [
  {
    id: '1',
    uuid: '11111111-1111-1111-1111-111111111111',
    name: 'September 2026 Regular Payrun',
    reference: 'PAYRUN-2026-09',
    period_start: '2026-09-01',
    period_end: '2026-09-30',
    status: 'paid',
    total_gross: 285000,
    total_deductions: 39900,
    total_net: 245100,
    employee_count: 3,
    created_at: '2026-09-01T00:00:00Z',
  },
];

export const samplePayslips = [
  {
    id: '101',
    uuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    payrun_id: '1',
    payrun_reference: 'PAYRUN-2026-09',
    employee_id: 1,
    employee_code: 'EMP-001',
    employee_name: 'Aarav Mehta',
    designation: 'Senior Financial Analyst',
    department: 'Finance',
    period_start: '2026-09-01',
    period_end: '2026-09-30',
    basic_salary: 52500,
    gross_salary: 105000,
    total_deductions: 14700,
    net_salary: 90300,
    status: 'paid',
    worked_days: 30,
    paid_leaves: 2,
    unpaid_leaves: 0,
    lines: [
      { code: 'BASIC', name: 'Basic Salary', category: 'BASIC', amount: 52500 },
      { code: 'HRA', name: 'House Rent Allowance', category: 'ALLOWANCE', amount: 26250 },
      { code: 'CONV', name: 'Conveyance Allowance', category: 'ALLOWANCE', amount: 10500 },
      { code: 'SPECIAL', name: 'Special Allowance', category: 'ALLOWANCE', amount: 15750 },
      { code: 'PF', name: 'Provident Fund (12%)', category: 'DEDUCTION', amount: 6300 },
      { code: 'TDS', name: 'Income Tax TDS (6.5%)', category: 'DEDUCTION', amount: 6825 },
    ],
  },
  {
    id: '102',
    uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    payrun_id: '1',
    payrun_reference: 'PAYRUN-2026-09',
    employee_id: 2,
    employee_code: 'EMP-002',
    employee_name: 'Sara Khan',
    designation: 'HR Operations Lead',
    department: 'HR',
    period_start: '2026-09-01',
    period_end: '2026-09-30',
    basic_salary: 45000,
    gross_salary: 90000,
    total_deductions: 12600,
    net_salary: 77400,
    status: 'paid',
    worked_days: 30,
    paid_leaves: 1,
    unpaid_leaves: 0,
    lines: [
      { code: 'BASIC', name: 'Basic Salary', category: 'BASIC', amount: 45000 },
      { code: 'HRA', name: 'House Rent Allowance', category: 'ALLOWANCE', amount: 22500 },
      { code: 'CONV', name: 'Conveyance Allowance', category: 'ALLOWANCE', amount: 9000 },
      { code: 'SPECIAL', name: 'Special Allowance', category: 'ALLOWANCE', amount: 13500 },
      { code: 'PF', name: 'Provident Fund (12%)', category: 'DEDUCTION', amount: 5400 },
      { code: 'TDS', name: 'Income Tax TDS (6.5%)', category: 'DEDUCTION', amount: 5850 },
    ],
  },
  {
    id: '103',
    uuid: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    payrun_id: '1',
    payrun_reference: 'PAYRUN-2026-09',
    employee_id: 3,
    employee_code: 'EMP-003',
    employee_name: 'Anil Patel',
    designation: 'Full Stack Engineer',
    department: 'Engineering',
    period_start: '2026-09-01',
    period_end: '2026-09-30',
    basic_salary: 45000,
    gross_salary: 90000,
    total_deductions: 12600,
    net_salary: 77400,
    status: 'paid',
    worked_days: 30,
    paid_leaves: 0,
    unpaid_leaves: 0,
    lines: [
      { code: 'BASIC', name: 'Basic Salary', category: 'BASIC', amount: 45000 },
      { code: 'HRA', name: 'House Rent Allowance', category: 'ALLOWANCE', amount: 22500 },
      { code: 'CONV', name: 'Conveyance Allowance', category: 'ALLOWANCE', amount: 9000 },
      { code: 'SPECIAL', name: 'Special Allowance', category: 'ALLOWANCE', amount: 13500 },
      { code: 'PF', name: 'Provident Fund (12%)', category: 'DEDUCTION', amount: 5400 },
      { code: 'TDS', name: 'Income Tax TDS (6.5%)', category: 'DEDUCTION', amount: 5850 },
    ],
  },
];
