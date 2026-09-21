import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

export const CONTRACTS = [
  {
    id: 1,
    contract_code: 'CNT-001',
    employee_id: 1,
    contract_title: 'Full-Time Senior Financial Analyst',
    contract_type: 'Permanent',
    start_date: '2024-01-15',
    wage: 105000,
    working_hours_per_week: 40,
    salary_structure_id: 1,
    salary_structure_name: 'Standard Professional Structure',
    status: 'Running',
    employee: { first_name: 'Aarav', last_name: 'Mehta', department: 'Finance' },
  },
  {
    id: 2,
    contract_code: 'CNT-002',
    employee_id: 2,
    contract_title: 'HR Lead Employment Agreement',
    contract_type: 'Permanent',
    start_date: '2023-06-01',
    wage: 90000,
    working_hours_per_week: 40,
    salary_structure_id: 1,
    salary_structure_name: 'Standard Professional Structure',
    status: 'Running',
    employee: { first_name: 'Sara', last_name: 'Khan', department: 'HR' },
  },
  {
    id: 3,
    contract_code: 'CNT-003',
    employee_id: 3,
    contract_title: 'Full Stack Engineer Contract',
    contract_type: 'Permanent',
    start_date: '2024-03-01',
    wage: 90000,
    working_hours_per_week: 40,
    salary_structure_id: 1,
    salary_structure_name: 'Standard Professional Structure',
    status: 'Running',
    employee: { first_name: 'Anil', last_name: 'Patel', department: 'Engineering' },
  },
];

export const ATTENDANCES = [
  {
    id: 1,
    employee_id: 1,
    attendance_date: '2026-09-02',
    check_in: '09:00:00',
    check_out: '18:00:00',
    worked_hours: 9.0,
    overtime_hours: 1.0,
    status: 'PRESENT',
    employee: { first_name: 'Aarav', last_name: 'Mehta', department: 'Finance' },
  },
  {
    id: 2,
    employee_id: 2,
    attendance_date: '2026-09-02',
    check_in: '09:15:00',
    check_out: '17:45:00',
    worked_hours: 8.5,
    overtime_hours: 0.5,
    status: 'PRESENT',
    employee: { first_name: 'Sara', last_name: 'Khan', department: 'HR' },
  },
];

export const STRUCTURES = [
  {
    id: 1,
    code: 'STD_PROF',
    name: 'Standard Professional Structure',
    description: '50% Basic, 25% HRA, PF 12%, TDS Progressive',
    is_active: true,
    rules: [
      { code: 'BASIC', name: 'Basic Salary', category: 'BASIC', rule_type: 'PERCENTAGE', amount_or_percentage: 50, sequence: 1, is_active: true },
      { code: 'HRA', name: 'House Rent Allowance', category: 'ALLOWANCE', rule_type: 'PERCENTAGE', amount_or_percentage: 25, sequence: 2, is_active: true },
      { code: 'PF', name: 'Provident Fund', category: 'DEDUCTION', rule_type: 'PERCENTAGE', amount_or_percentage: 12, sequence: 3, is_active: true },
      { code: 'TDS', name: 'Income Tax TDS', category: 'DEDUCTION', rule_type: 'PERCENTAGE', amount_or_percentage: 6.5, sequence: 4, is_active: true },
    ],
  },
];

// ── Contracts ──
router.get('/contracts', async (req, res) => {
  const { status } = req.query;
  try {
    const dbRes = await query(`
      SELECT c.*, e.first_name, e.last_name, e.job_title, d.name as department_name, s.name as structure_name
      FROM contracts c
      LEFT JOIN employees e ON c.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN salary_structures s ON c.salary_structure_id = s.id
      ORDER BY c.id ASC;
    `);
    if (dbRes.rows && dbRes.rows.length > 0) {
      let formatted = dbRes.rows.map((c, idx) => ({
        id: idx + 1,
        uuid: String(c.id),
        contract_code: `CNT-${String(idx + 1).padStart(3, '0')}`,
        employee_id: idx + 1,
        contract_title: `${c.job_title || 'Employee'} Contract`,
        contract_type: c.contract_type || 'Permanent',
        start_date: c.start_date ? new Date(c.start_date).toISOString().split('T')[0] : '2024-01-15',
        wage: Number(c.salary || c.wage || 75000),
        working_hours_per_week: Number(c.working_hours_per_week || 40.0),
        salary_structure_id: 1,
        salary_structure_name: c.structure_name || 'Standard Professional Structure',
        status: (c.status || '').toLowerCase() === 'active' ? 'Running' : c.status || 'Running',
        employee: {
          first_name: c.first_name || 'Employee',
          last_name: c.last_name || '',
          department: c.department_name || 'Operations',
        },
      }));
      if (status && status !== 'ALL') {
        formatted = formatted.filter(c => c.status.toLowerCase() === status.toLowerCase());
      }
      return res.json(formatted);
    }
  } catch (err) {
    // fallback
  }
  let result = CONTRACTS;
  if (status && status !== 'ALL') {
    result = result.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }
  return res.json(result);
});

router.get('/contracts/:id', (req, res) => {
  const cid = Number(req.params.id);
  const contract = CONTRACTS.find(c => c.id === cid);
  if (contract) return res.json(contract);
  return res.status(404).json({ detail: 'Contract not found' });
});

router.post('/contracts', (req, res) => {
  const data = req.body || {};
  const newId = CONTRACTS.length + 1;
  const newContract = {
    id: newId,
    contract_code: `CNT-${String(newId).padStart(3, '0')}`,
    employee_id: data.employee_id || 1,
    contract_title: data.contract_title || 'Employment Contract',
    contract_type: data.contract_type || 'Permanent',
    start_date: data.start_date || '2026-09-01',
    wage: Number(data.wage || 75000),
    working_hours_per_week: Number(data.working_hours_per_week || 40),
    status: 'Running',
  };
  CONTRACTS.push(newContract);
  return res.status(201).json(newContract);
});

// ── Attendances ──
router.get('/attendances', (req, res) => {
  return res.json(ATTENDANCES);
});

router.post('/attendances/check-in', (req, res) => {
  return res.json({ status: 'checked_in', time: '09:00 AM' });
});

router.post('/attendances/check-out', (req, res) => {
  return res.json({ status: 'checked_out', time: '06:00 PM' });
});

// ── Salary Structures ──
const listStructures = (req, res) => res.json(STRUCTURES);
const getStructure = (req, res) => {
  const sid = Number(req.params.id);
  const s = STRUCTURES.find(item => item.id === sid);
  if (s) return res.json(s);
  return res.status(404).json({ detail: 'Salary structure not found' });
};
const createStructure = (req, res) => {
  const data = req.body || {};
  const newId = STRUCTURES.length + 1;
  const newStructure = {
    id: newId,
    code: data.code || `STR_${newId}`,
    name: data.name || 'Custom Salary Structure',
    description: data.description || '',
    is_active: true,
    rules: data.rules || [],
  };
  STRUCTURES.push(newStructure);
  return res.status(201).json(newStructure);
};

router.get('/salary/structures', listStructures);
router.get('/salary-structures', listStructures);
router.get('/salary/structures/:id', getStructure);
router.get('/salary-structures/:id', getStructure);
router.post('/salary/structures', createStructure);
router.post('/salary-structures', createStructure);

router.post('/salary/rules', (req, res) => {
  const data = req.body || {};
  const newRule = {
    id: 100,
    code: data.code || 'CUSTOM',
    name: data.name || 'Custom Rule',
    category: data.category || 'ALLOWANCE',
    rule_type: data.rule_type || 'PERCENTAGE',
    amount_or_percentage: data.amount_or_percentage || 10,
    sequence: data.sequence || 1,
    is_active: true,
  };
  return res.status(201).json(newRule);
});

export default router;
