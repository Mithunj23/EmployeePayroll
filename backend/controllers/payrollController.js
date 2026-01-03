const PDFDocument = require('pdfkit');
const Payroll = require('../models/Payroll');

// CREATE payroll record in DB (admin only)
exports.generatePayroll = async (req, res) => {
  try {
    // Only admins can generate payroll
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { employeeId, month, year } = req.body;

    if (!employeeId || !month || !year) {
      return res.status(400).json({ message: 'Employee ID, month, and year are required.' });
    }

    const existing = await Payroll.findOne({ employeeId, month: parseInt(month, 10), year: parseInt(year, 10) });
    if (existing) {
      return res.status(409).json({ message: 'Payroll already exists for this employee and period.' });
    }

    const payroll = new Payroll({
      employeeId,
      month: parseInt(month, 10),
      year: parseInt(year, 10),
      paymentStatus: 'Pending',
      earnings: { basicSalary: 0, hra: 0, da: 0, otherAllowances: 0, bonus: 0, overtime: 0 },
      deductions: { pf: 0, tax: 0, insurance: 0, loanDeduction: 0, lateDeduction: 0 },
      grossSalary: 0,
      totalDeductions: 0,
      netSalary: 0,
      workingDays: 0,
      presentDays: 0
    });

    await payroll.save();

    res.status(201).json({
      message: 'Payroll generated successfully',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET filtered payrolls - admin: all, employee: only their own
exports.getAllPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = {};
    if (month) filter.month = parseInt(month, 10);
    if (year) filter.year = parseInt(year, 10);

    // If employee, restrict to own payrolls
    if (req.user.role === 'employee') {
      filter.employeeId = req.user.employeeId;
    }

    const payrolls = await Payroll.find(filter).populate('employeeId');
    res.json({ data: payrolls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single payroll by ID - employee only if owns the payroll
exports.getPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('employeeId');
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

    if (req.user.role === 'employee' && payroll.employeeId._id.toString() !== req.user.employeeId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ data: payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE payroll status - admin only
exports.updatePayrollStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus, paymentDate: req.body.paymentDate },
      { new: true }
    );
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
    res.json({ data: payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET payslips for an employee - admin: any employee, employee: only self
exports.getEmployeePayslips = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    if (req.user.role === 'employee' && req.user.employeeId.toString() !== employeeId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const payslips = await Payroll.find({ employeeId });
    res.json({ data: payslips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download payslip as PDF
exports.downloadPayslip = async (req, res) => {
  try {
    const payrollId = req.params.id;
    const payroll = await Payroll.findById(payrollId).populate('employeeId');
    if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });

    if (req.user.role === 'employee' && payroll.employeeId._id.toString() !== req.user.employeeId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const employee = payroll.employeeId || {};
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=payslip_${employee.employeeCode || 'unknown'}_${payroll.month}_${payroll.year}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(18).text('Payslip', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Employee: ${employee.firstName ?? 'N/A'} ${employee.lastName ?? ''}`);
    doc.text(`Employee Code: ${employee.employeeCode ?? 'N/A'}`);
    doc.text(`Month/Year: ${payroll.month}/${payroll.year}`);
    doc.text(`Payment Status: ${payroll.paymentStatus}`);
    doc.moveDown();

    doc.text('Earnings:', { underline: true });
    if (payroll.earnings) {
      Object.entries(payroll.earnings).forEach(([key, value]) => {
        doc.text(`${capitalize(key)}: ₹${formatNumber(value)}`);
      });
    }
    doc.moveDown();

    doc.text('Deductions:', { underline: true });
    if (payroll.deductions) {
      Object.entries(payroll.deductions).forEach(([key, value]) => {
        doc.text(`${capitalize(key)}: ₹${formatNumber(value)}`);
      });
    }
    doc.moveDown();

    doc.text(`Gross Salary: ₹${formatNumber(payroll.grossSalary)}`);
    doc.text(`Total Deductions: ₹${formatNumber(payroll.totalDeductions)}`);
    doc.text(`Net Salary: ₹${formatNumber(payroll.netSalary)}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Helper functions
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1').trim();
}

function formatNumber(num) {
  return Number(num).toFixed(2);
}
