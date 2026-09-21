import PDFDocument from 'pdfkit';

export const generatePayslipPdfBuffer = (payslip) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // ── Header / Brand ──
      doc.fontSize(22).fillColor('#1E293B').font('Helvetica-Bold').text('PEOPLEPAY 360', 40, 45);
      doc.fontSize(10).fillColor('#64748B').font('Helvetica').text('Enterprise HR & Intelligent Payroll Platform', 40, 72);
      doc.fontSize(14).fillColor('#2563EB').font('Helvetica-Bold').text('PAYSLIP / SALARY STATEMENT', 360, 45, { align: 'right' });
      doc.fontSize(9).fillColor('#64748B').font('Helvetica').text(`Pay Period: ${payslip.period_start || '2026-09-01'} to ${payslip.period_end || '2026-09-30'}`, 360, 65, { align: 'right' });
      doc.fontSize(9).fillColor('#10B981').font('Helvetica-Bold').text(`STATUS: ${String(payslip.status || 'PAID').toUpperCase()}`, 360, 80, { align: 'right' });

      doc.moveTo(40, 100).lineTo(555, 100).strokeColor('#CBD5E1').lineWidth(1).stroke();

      // ── Employee & Pay Info Grid ──
      let y = 115;
      doc.fontSize(9).fillColor('#64748B').font('Helvetica-Bold').text('EMPLOYEE DETAILS', 40, y);
      doc.fontSize(9).fillColor('#64748B').font('Helvetica-Bold').text('PAYMENT DETAILS', 300, y);

      y += 18;
      doc.fontSize(9).fillColor('#1E293B').font('Helvetica-Bold').text('Name:', 40, y);
      doc.font('Helvetica').text(payslip.employee_name || 'Aarav Mehta', 120, y);
      doc.font('Helvetica-Bold').text('Payrun Ref:', 300, y);
      doc.font('Helvetica').text(payslip.payrun_reference || 'PAYRUN-2026-09', 400, y);

      y += 16;
      doc.font('Helvetica-Bold').text('Employee ID:', 40, y);
      doc.font('Helvetica').text(payslip.employee_code || 'EMP-001', 120, y);
      doc.font('Helvetica-Bold').text('Bank Account:', 300, y);
      doc.font('Helvetica').text('XXXX-XXXX-8921', 400, y);

      y += 16;
      doc.font('Helvetica-Bold').text('Department:', 40, y);
      doc.font('Helvetica').text(payslip.department || 'Finance', 120, y);
      doc.font('Helvetica-Bold').text('Payment Mode:', 300, y);
      doc.font('Helvetica').text('Direct Bank Transfer (NEFT)', 400, y);

      y += 16;
      doc.font('Helvetica-Bold').text('Designation:', 40, y);
      doc.font('Helvetica').text(payslip.designation || 'Specialist', 120, y);
      doc.font('Helvetica-Bold').text('Worked Days:', 300, y);
      doc.font('Helvetica').text(`${payslip.worked_days || 30} Days`, 400, y);

      y += 28;
      doc.moveTo(40, y).lineTo(555, y).strokeColor('#E2E8F0').lineWidth(1).stroke();

      // ── Earnings and Deductions Table Header ──
      y += 15;
      doc.rect(40, y, 250, 22).fill('#F1F5F9');
      doc.rect(300, y, 255, 22).fill('#F1F5F9');

      doc.fontSize(9).fillColor('#1E293B').font('Helvetica-Bold').text('EARNINGS', 50, y + 6);
      doc.text('AMOUNT (₹)', 220, y + 6, { align: 'right' });

      doc.text('DEDUCTIONS', 310, y + 6);
      doc.text('AMOUNT (₹)', 480, y + 6, { align: 'right' });

      y += 28;
      const earnings = (payslip.lines || []).filter(l => l.category !== 'DEDUCTION');
      const deductions = (payslip.lines || []).filter(l => l.category === 'DEDUCTION');
      const maxRows = Math.max(earnings.length, deductions.length, 1);

      for (let i = 0; i < maxRows; i++) {
        const earn = earnings[i];
        const ded = deductions[i];

        if (earn) {
          doc.fontSize(8.5).fillColor('#334155').font('Helvetica').text(earn.name, 50, y);
          doc.text(`₹${Number(earn.amount || 0).toLocaleString('en-IN')}`, 220, y, { align: 'right' });
        }
        if (ded) {
          doc.fontSize(8.5).fillColor('#334155').font('Helvetica').text(ded.name, 310, y);
          doc.text(`₹${Number(ded.amount || 0).toLocaleString('en-IN')}`, 480, y, { align: 'right' });
        }
        y += 18;
      }

      // ── Subtotals ──
      y += 10;
      doc.moveTo(40, y).lineTo(555, y).strokeColor('#E2E8F0').lineWidth(1).stroke();
      y += 8;

      doc.fontSize(9).fillColor('#1E293B').font('Helvetica-Bold').text('Total Earnings (Gross):', 50, y);
      doc.text(`₹${Number(payslip.gross_salary || 0).toLocaleString('en-IN')}`, 220, y, { align: 'right' });

      doc.text('Total Deductions:', 310, y);
      doc.text(`₹${Number(payslip.total_deductions || 0).toLocaleString('en-IN')}`, 480, y, { align: 'right' });

      // ── Net Pay Box ──
      y += 35;
      doc.rect(40, y, 515, 45).fillAndStroke('#EFF6FF', '#3B82F6');
      doc.fontSize(10).fillColor('#1E40AF').font('Helvetica-Bold').text('TAKE HOME / NET PAYABLE SALARY:', 60, y + 16);
      doc.fontSize(16).fillColor('#1E3A8A').font('Helvetica-Bold').text(`₹${Number(payslip.net_salary || 0).toLocaleString('en-IN')}`, 340, y + 14, { align: 'right' });

      // ── Footer ──
      y += 80;
      doc.fontSize(8).fillColor('#94A3B8').font('Helvetica').text('This is a system-generated salary payslip authenticated via PeoplePay360. No physical signature is required.', 40, y, { align: 'center', width: 515 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
