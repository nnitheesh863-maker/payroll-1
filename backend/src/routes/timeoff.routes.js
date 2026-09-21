import express from 'express';

const router = express.Router();

export const TIME_OFF_TYPES = [
  {
    id: 1,
    name: 'Casual Leave',
    code: 'CASUAL',
    unit: 'Days',
    requires_allocation: 'Yes',
    approval: 'Manager',
    payroll_work_entry: 'Paid Leave (100% Salary)',
    display_color: 'Amber',
    active: true,
    config_notes: 'Standard annual casual leaves. Full salary paid; consumes leave allocation.',
  },
  {
    id: 2,
    name: 'Paid Time Off',
    code: 'PTO',
    unit: 'Days',
    requires_allocation: 'Yes',
    approval: 'Manager',
    payroll_work_entry: 'Paid Leave',
    display_color: 'Blue',
    active: true,
    config_notes: 'Standard annual leave. Balance comes from approved allocations.',
  },
  {
    id: 3,
    name: 'Sick Leave',
    code: 'SICK',
    unit: 'Days',
    requires_allocation: 'Yes',
    approval: 'Manager',
    payroll_work_entry: 'Paid Sick Leave',
    display_color: 'Rose',
    active: true,
    config_notes: 'Statutory health leave with full compensation.',
  },
  {
    id: 4,
    name: 'Unpaid Leave (LOP)',
    code: 'UNPAID',
    unit: 'Days',
    requires_allocation: 'No',
    approval: 'Manager',
    payroll_work_entry: 'Loss of Pay (LOP) Deduction',
    display_color: 'Red',
    active: true,
    config_notes: 'Unpaid leave that results in direct per-day salary deduction during payrun.',
  },
  {
    id: 5,
    name: 'Comp Off',
    code: 'COMP',
    unit: 'Hours',
    requires_allocation: 'No',
    approval: 'Officer',
    payroll_work_entry: 'Compensatory Entry',
    display_color: 'Emerald',
    active: true,
    config_notes: 'Granted for weekend or overtime shifts.',
  },
];

export const ALLOCATIONS = [
  {
    id: 1,
    employee_id: 101,
    employee_name: 'Nitheesh',
    time_off_type_id: 1,
    time_off_type_name: 'Casual Leave',
    allocated_days: 12,
    taken_days: 0,
    remaining_days: 12,
    status: 'Approved',
    approver: 'Team Manager - Arun',
    validity: '2026 Annual Quota',
    description: 'Annual Casual Leave allocation for Nitheesh (12 days/year).',
  },
  {
    id: 2,
    employee_id: 1,
    employee_name: 'Aarav Mehta',
    time_off_type_id: 2,
    time_off_type_name: 'Paid Time Off',
    allocated_days: 20,
    taken_days: 8,
    remaining_days: 12,
    status: 'Approved',
    approver: 'Sara Khan',
    validity: '2026 Annual Balance',
    description: 'Annual leave balance granted at start of policy year.',
  },
  {
    id: 3,
    employee_id: 2,
    employee_name: 'Sara Khan',
    time_off_type_id: 2,
    time_off_type_name: 'Paid Time Off',
    allocated_days: 20,
    taken_days: 6,
    remaining_days: 14,
    status: 'Approved',
    approver: 'System Admin',
    validity: '2026 Annual Balance',
    description: 'HR Manager annual leave quota.',
  },
  {
    id: 4,
    employee_id: 3,
    employee_name: 'Anil Patel',
    time_off_type_id: 5,
    time_off_type_name: 'Comp Off',
    allocated_days: 2,
    taken_days: 1,
    remaining_days: 1,
    status: 'To Approve',
    approver: 'HR Manager - Sara Khan',
    validity: 'Q3 2026 Overtime',
    description: 'Compensation for deployment weekend.',
  },
];

export const REQUESTS = [
  {
    id: 1,
    employee_id: 101,
    employee_name: 'Nitheesh',
    time_off_type_id: 1,
    time_off_type_name: 'Casual Leave',
    start_date: '10-Sep-2026',
    end_date: '12-Sep-2026',
    duration: '3 Days',
    days_count: 3,
    status: 'To Approve',
    approver: 'Team Manager - Arun',
    allocation_used: 'Casual Leave 2026',
    reason: 'Personal work',
  },
  {
    id: 2,
    employee_id: 1,
    employee_name: 'Aarav Mehta',
    time_off_type_id: 2,
    time_off_type_name: 'Paid Time Off',
    start_date: '12-Sep-2026',
    end_date: '14-Sep-2026',
    duration: '3 Days',
    days_count: 3,
    status: 'Approved',
    approver: 'Sara Khan',
    allocation_used: 'Paid Time Off 2026',
    reason: 'Family vacation',
  },
  {
    id: 3,
    employee_id: 2,
    employee_name: 'Sara Khan',
    time_off_type_id: 3,
    time_off_type_name: 'Sick Leave',
    start_date: '10-Sep-2026',
    end_date: '11-Sep-2026',
    duration: '2 Days',
    days_count: 2,
    status: 'Approved',
    approver: 'System Admin',
    allocation_used: 'Not Required',
    reason: 'Doctor appointment',
  },
];

// ── Types ──
router.get('/types', (req, res) => res.json(TIME_OFF_TYPES));

router.post('/types', (req, res) => {
  const data = req.body || {};
  const newType = {
    id: TIME_OFF_TYPES.length + 1,
    name: data.name || 'New Leave Type',
    code: data.code || 'NEW',
    unit: data.unit || 'Days',
    requires_allocation: data.requires_allocation || 'Yes',
    approval: data.approval || 'Manager',
    payroll_work_entry: data.payroll_work_entry || 'Leave Work Entry',
    display_color: data.display_color || 'Blue',
    active: true,
    config_notes: data.config_notes || '',
  };
  TIME_OFF_TYPES.push(newType);
  return res.status(201).json(newType);
});

router.put('/types/:id', (req, res) => {
  const tid = Number(req.params.id);
  const type = TIME_OFF_TYPES.find(t => t.id === tid);
  if (type) {
    Object.assign(type, req.body || {});
    return res.json(type);
  }
  return res.status(404).json({ detail: 'Time off type not found' });
});

// ── Allocations ──
router.get('/allocations', (req, res) => res.json(ALLOCATIONS));

router.post('/allocations', (req, res) => {
  const data = req.body || {};
  const allocated = Number(data.allocated_days || 10);
  const newAlloc = {
    id: ALLOCATIONS.length + 1,
    employee_id: data.employee_id || 1,
    employee_name: data.employee_name || 'Nitheesh',
    time_off_type_id: data.time_off_type_id || 1,
    time_off_type_name: data.time_off_type_name || 'Casual Leave',
    allocated_days: allocated,
    taken_days: 0,
    remaining_days: allocated,
    status: 'To Approve',
    approver: data.approver || 'Team Manager - Arun',
    validity: data.validity || '2026 Annual Quota',
    description: data.description || 'Annual leave quota allocation',
  };
  ALLOCATIONS.push(newAlloc);
  return res.status(201).json(newAlloc);
});

router.post('/allocations/:id/approve', (req, res) => {
  const aid = Number(req.params.id);
  const alloc = ALLOCATIONS.find(a => a.id === aid);
  if (alloc) {
    alloc.status = 'Approved';
    return res.json(alloc);
  }
  return res.status(404).json({ detail: 'Allocation not found' });
});

router.post('/allocations/:id/refuse', (req, res) => {
  const aid = Number(req.params.id);
  const alloc = ALLOCATIONS.find(a => a.id === aid);
  if (alloc) {
    alloc.status = 'Refused';
    return res.json(alloc);
  }
  return res.status(404).json({ detail: 'Allocation not found' });
});

// ── Requests ──
router.get('/requests', (req, res) => res.json(REQUESTS));

router.post('/requests', (req, res) => {
  const data = req.body || {};
  const days = Number(data.days_count || 1);
  const typeName = data.time_off_type_name || 'Casual Leave';
  const newReq = {
    id: REQUESTS.length + 1,
    employee_id: data.employee_id || 101,
    employee_name: data.employee_name || 'Nitheesh',
    time_off_type_id: data.time_off_type_id || 1,
    time_off_type_name: typeName,
    start_date: data.start_date || '10-Sep-2026',
    end_date: data.end_date || '12-Sep-2026',
    duration: days === 1 ? '1 Day' : `${days} Days`,
    days_count: days,
    status: 'To Approve',
    approver: data.approver || 'Team Manager - Arun',
    allocation_used: !typeName.toLowerCase().includes('unpaid') ? `${typeName} 2026` : 'Not Required',
    reason: data.reason || 'Personal work',
  };
  REQUESTS.push(newReq);
  return res.status(201).json(newReq);
});

router.post('/requests/:id/approve', (req, res) => {
  const rid = Number(req.params.id);
  const r = REQUESTS.find(reqItem => reqItem.id === rid);
  if (!r) return res.status(404).json({ detail: 'Request not found' });

  r.status = 'Approved';

  let allocatedBefore = 12;
  let takenBefore = 0;
  let allocatedAfter = 12;
  let takenAfter = 0;

  const matchAlloc = ALLOCATIONS.find(
    a =>
      a.employee_name.toLowerCase() === r.employee_name.toLowerCase() &&
      a.time_off_type_name.toLowerCase() === r.time_off_type_name.toLowerCase()
  );

  if (matchAlloc) {
    allocatedBefore = matchAlloc.allocated_days;
    takenBefore = matchAlloc.taken_days;
    matchAlloc.taken_days += r.days_count;
    matchAlloc.remaining_days = Math.max(0, matchAlloc.allocated_days - matchAlloc.taken_days);
    allocatedAfter = matchAlloc.allocated_days;
    takenAfter = matchAlloc.taken_days;
  }

  const isUnpaid = r.time_off_type_name.toLowerCase().includes('unpaid') || r.time_off_type_name.toLowerCase().includes('lop');
  const monthlySalary = 30000.0;
  const dailyRate = Math.round((monthlySalary / 30.0) * 100) / 100;
  const lopDeduction = isUnpaid ? Math.round(r.days_count * dailyRate * 100) / 100 : 0.0;
  const netSalary = Math.round((monthlySalary - lopDeduction) * 100) / 100;

  r.payroll_impact = {
    employee_name: r.employee_name,
    leave_type: r.time_off_type_name,
    duration_days: r.days_count,
    is_paid_leave: !isUnpaid,
    monthly_salary: monthlySalary,
    daily_rate: dailyRate,
    lop_deduction: lopDeduction,
    net_salary: netSalary,
    allocation_before: { allocated: allocatedBefore, used: takenBefore, remaining: Math.max(0, allocatedBefore - takenBefore) },
    allocation_after: { allocated: allocatedAfter, used: takenAfter, remaining: Math.max(0, allocatedAfter - takenAfter) },
    attendance_updated: `Marked ${r.days_count} day(s) as ON_LEAVE in attendance records.`,
  };

  return res.json(r);
});

router.post('/requests/:id/refuse', (req, res) => {
  const rid = Number(req.params.id);
  const r = REQUESTS.find(reqItem => reqItem.id === rid);
  if (r) {
    r.status = 'Refused';
    return res.json(r);
  }
  return res.status(404).json({ detail: 'Request not found' });
});

// ── LOP Simulator ──
router.post('/simulate-payroll-lop', (req, res) => {
  const data = req.body || {};
  const empName = String(data.employee_name || 'Nitheesh').trim();
  const monthlySalary = Number(data.monthly_salary || 30000);
  const leaveType = String(data.leave_type || 'Casual Leave').trim();
  const leaveDays = Number(data.leave_days || 3);
  const allocatedDays = Number(data.allocated_days || 12);
  const usedDays = Number(data.used_days || 0);

  const isUnpaid = leaveType.toLowerCase().includes('unpaid') || leaveType.toLowerCase().includes('lop');
  const dailyRate = Math.round((monthlySalary / 30.0) * 100) / 100;
  const lopDeduction = isUnpaid ? Math.round(leaveDays * dailyRate * 100) / 100 : 0.0;
  const netSalary = Math.round((monthlySalary - lopDeduction) * 100) / 100;

  const newUsed = usedDays + (isUnpaid ? 0 : leaveDays);
  const newRemaining = Math.max(0, allocatedDays - newUsed);

  return res.json({
    employee_name: empName,
    leave_type: leaveType,
    is_paid_leave: !isUnpaid,
    monthly_salary: monthlySalary,
    daily_rate: dailyRate,
    leave_days: leaveDays,
    lop_deduction: lopDeduction,
    net_salary: netSalary,
    balance: {
      allocated: allocatedDays,
      used_before: usedDays,
      remaining_before: Math.max(0, allocatedDays - usedDays),
      used_after: newUsed,
      remaining_after: newRemaining,
    },
    attendance: {
      status: 'ON_LEAVE',
      working_days_in_month: 30,
      attended_days: 30 - Math.floor(leaveDays),
      paid_leave_days: isUnpaid ? 0 : Math.floor(leaveDays),
      unpaid_leave_days: isUnpaid ? Math.floor(leaveDays) : 0,
    },
    explanation: !isUnpaid
      ? `Since '${leaveType}' is a PAID leave, ${Math.floor(leaveDays)} day(s) consume your allocated quota without salary deduction. Net Salary is ₹${netSalary.toLocaleString('en-IN')}.`
      : `Since '${leaveType}' is an UNPAID leave, LOP of ${Math.floor(leaveDays)} × ₹${dailyRate}/day = ₹${lopDeduction.toLocaleString('en-IN')} is deducted from Gross Salary. Net Salary is ₹${netSalary.toLocaleString('en-IN')}.`,
  });
});

export default router;
