import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

export const EMPLOYEES = [
  {
    id: 1,
    emp_code: 'EMP-001',
    first_name: 'Aarav',
    last_name: 'Mehta',
    email: 'aarav.mehta@peoplepay360.com',
    phone: '+91 98765 43210',
    department: 'Finance',
    position: 'Senior Financial Analyst',
    joining_date: '2024-01-15',
    status: 'ACTIVE',
    manager: 'Sara Khan',
    work_location: 'Bangalore HQ',
    company: 'PeoplePay360 Global',
    working_hours: 'Standard 40h / week',
    bank_account_number: 'XXXX-XXXX-8921',
    bank_name: 'HDFC Bank',
    bank_ifsc: 'HDFC0001234',
    pan_number: 'ABCDE1234F',
    pf_number: 'PF/BLR/00912/001',
    uan_number: '100982348123',
    address: 'Indiranagar, Bangalore, Karnataka',
    emergency_contact: '+91 98765 00000',
  },
  {
    id: 2,
    emp_code: 'EMP-002',
    first_name: 'Sara',
    last_name: 'Khan',
    email: 'sara.khan@peoplepay360.com',
    phone: '+91 98765 43211',
    department: 'HR',
    position: 'HR Operations Lead',
    joining_date: '2023-06-01',
    status: 'ACTIVE',
    manager: 'System Admin',
    work_location: 'Bangalore HQ',
    company: 'PeoplePay360 Global',
    working_hours: 'Standard 40h / week',
    bank_account_number: 'XXXX-XXXX-4432',
    bank_name: 'ICICI Bank',
    bank_ifsc: 'ICIC0004321',
    pan_number: 'FGHIJ5678K',
    pf_number: 'PF/BLR/00912/002',
    uan_number: '100982348124',
    address: 'Koramangala, Bangalore, Karnataka',
    emergency_contact: '+91 98765 11111',
  },
  {
    id: 3,
    emp_code: 'EMP-003',
    first_name: 'Anil',
    last_name: 'Patel',
    email: 'anil.patel@peoplepay360.com',
    phone: '+91 98765 43212',
    department: 'Engineering',
    position: 'Full Stack Engineer',
    joining_date: '2024-03-01',
    status: 'ACTIVE',
    manager: 'Sara Khan',
    work_location: 'Bangalore HQ',
    company: 'PeoplePay360 Global',
    working_hours: 'Standard 40h / week',
    bank_account_number: 'XXXX-XXXX-1122',
    bank_name: 'State Bank of India',
    bank_ifsc: 'SBIN0001122',
    pan_number: 'KLMNO9012P',
    pf_number: 'PF/BLR/00912/003',
    uan_number: '100982348125',
    address: 'Whitefield, Bangalore, Karnataka',
    emergency_contact: '+91 98765 22222',
  },
];

const serializeDbEmployee = (emp, idx) => {
  return {
    id: idx,
    uuid: emp.id ? String(emp.id) : undefined,
    emp_code: emp.employee_code || `EMP-${String(idx).padStart(3, '0')}`,
    first_name: emp.first_name,
    last_name: emp.last_name,
    email: emp.email,
    phone: emp.phone || '+91 98765 43210',
    department: emp.department_name || (emp.department ? emp.department.name : 'Engineering'),
    position: emp.job_title || 'Specialist',
    joining_date: emp.joining_date ? new Date(emp.joining_date).toISOString().split('T')[0] : '2024-01-15',
    status: emp.employment_status ? emp.employment_status.toUpperCase() : 'ACTIVE',
    manager: 'Sara Khan',
    work_location: 'Bangalore HQ',
    company: 'PeoplePay360 Global',
    working_hours: 'Standard 40h / week',
    bank_account_number: emp.bank_account_number || `XXXX-XXXX-${1000 + idx}`,
    bank_name: emp.bank_name || 'HDFC Bank',
    bank_ifsc: emp.bank_ifsc_code || 'HDFC0001234',
    pan_number: 'ABCDE1234F',
    pf_number: `PF/BLR/00912/${String(idx).padStart(3, '0')}`,
    uan_number: `1009823481${String(idx).padStart(2, '0')}`,
    address: `${emp.city || 'Bangalore'}, ${emp.state || 'Karnataka'}`,
    emergency_contact: '+91 98765 00000',
  };
};

// ── List Employees ──
router.get('/', async (req, res) => {
  const { department, status, position, search } = req.query;

  let employeesList = EMPLOYEES;
  try {
    const dbRes = await query(`
      SELECT e.*, d.name as department_name 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.employee_code ASC;
    `);
    if (dbRes.rows && dbRes.rows.length > 0) {
      employeesList = dbRes.rows.map((row, index) => serializeDbEmployee(row, index + 1));
    }
  } catch (err) {
    employeesList = EMPLOYEES;
  }

  let result = [...employeesList];
  if (department && department.toUpperCase() !== 'ALL') {
    result = result.filter(e => e.department.toLowerCase() === department.toLowerCase());
  }
  if (status && status.toUpperCase() !== 'ALL') {
    result = result.filter(e => e.status.toLowerCase() === status.toLowerCase());
  }
  if (position && position.toUpperCase() !== 'ALL') {
    result = result.filter(e => e.position.toLowerCase() === position.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(
      e =>
        e.first_name.toLowerCase().includes(s) ||
        e.last_name.toLowerCase().includes(s) ||
        e.emp_code.toLowerCase().includes(s)
    );
  }

  return res.json(result);
});

// ── Get Single Employee ──
router.get('/:id', async (req, res) => {
  const empId = Number(req.params.id);

  try {
    const dbRes = await query(`
      SELECT e.*, d.name as department_name 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.employee_code ASC;
    `);
    if (dbRes.rows && empId >= 1 && empId <= dbRes.rows.length) {
      return res.json(serializeDbEmployee(dbRes.rows[empId - 1], empId));
    }
  } catch (err) {
    // fallback
  }

  const emp = EMPLOYEES.find(e => e.id === empId);
  if (emp) return res.json(emp);

  return res.status(404).json({ detail: 'Employee not found' });
});

// ── Create Employee ──
router.post('/', async (req, res) => {
  const data = req.body || {};
  const newId = (EMPLOYEES.reduce((max, e) => Math.max(max, e.id), 0) || 0) + 1;
  const newEmp = {
    id: newId,
    emp_code: `EMP-${String(newId).padStart(3, '0')}`,
    first_name: data.first_name || 'New',
    last_name: data.last_name || 'Employee',
    email: data.email || `emp${newId}@peoplepay360.com`,
    phone: data.phone || '+91 90000 00000',
    department: data.department || 'Engineering',
    position: data.position || 'Specialist',
    joining_date: data.joining_date || '2026-09-01',
    status: data.status || 'ACTIVE',
    manager: data.manager || 'Sara Khan',
    work_location: data.work_location || 'Bangalore HQ',
    company: 'PeoplePay360 Global',
    working_hours: 'Standard 40h / week',
  };
  EMPLOYEES.push(newEmp);
  return res.status(201).json(newEmp);
});

// ── Update Employee ──
router.put('/:id', async (req, res) => {
  const empId = Number(req.params.id);
  const data = req.body || {};
  const emp = EMPLOYEES.find(e => e.id === empId);
  if (emp) {
    Object.assign(emp, data);
    return res.json(emp);
  }
  return res.status(404).json({ detail: 'Employee not found' });
});

// ── Sub-resources ──
router.get('/:id/contracts', async (req, res) => {
  const empId = Number(req.params.id);
  const contracts = [
    {
      id: empId,
      contract_code: `CNT-${String(empId).padStart(3, '0')}`,
      employee_id: empId,
      contract_title: 'Full-Time Employment Agreement',
      contract_type: 'Permanent',
      start_date: '2024-01-15',
      wage: empId === 1 ? 105000 : 90000,
      working_hours_per_week: 40,
      salary_structure_id: 1,
      salary_structure_name: 'Standard Professional Structure',
      status: 'Running',
      employee: { first_name: empId === 1 ? 'Aarav' : 'Employee', last_name: 'Mehta', department: 'Finance' },
    },
  ];
  return res.json(contracts);
});

router.get('/:id/attendances', async (req, res) => {
  const empId = Number(req.params.id);
  const attendances = [
    {
      id: 1,
      employee_id: empId,
      attendance_date: '2026-09-02',
      check_in: '09:00:00',
      check_out: '18:00:00',
      worked_hours: 9.0,
      overtime_hours: 1.0,
      status: 'PRESENT',
    },
  ];
  return res.json(attendances);
});

router.get('/:id/payslips', async (req, res) => {
  const empId = Number(req.params.id);
  const payslips = [
    {
      id: 100 + empId,
      payrun_id: 1,
      employee_id: empId,
      employee_name: empId === 1 ? 'Aarav Mehta' : empId === 2 ? 'Sara Khan' : 'Anil Patel',
      payslip_number: `PS-2026-${100 + empId}`,
      period_start: '2026-09-01',
      period_end: '2026-09-30',
      basic_salary: empId === 1 ? 52500 : 45000,
      gross_salary: empId === 1 ? 105000 : 90000,
      total_deductions: empId === 1 ? 14700 : 12600,
      net_salary: empId === 1 ? 90300 : 77400,
      status: 'VALIDATED',
      worked_days: 30,
    },
  ];
  return res.json(payslips);
});

router.get('/:id/time-off', async (req, res) => {
  const empId = Number(req.params.id);
  const emp = EMPLOYEES.find(e => e.id === empId);
  const records = [
    {
      id: 1,
      employee_id: empId,
      employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Employee',
      time_off_type_name: 'Casual Leave',
      start_date: '2026-09-10',
      end_date: '2026-09-12',
      days_count: 3,
      status: 'Approved',
    },
  ];
  return res.json(records);
});

export default router;
