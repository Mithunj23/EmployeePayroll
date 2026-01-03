const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  workingDays: {
    type: Number,
    required: true,
  },
  presentDays: {
    type: Number,
    required: true,
  },
  earnings: {
    basicSalary: {
      type: Number,
      required: true,
    },
    hra: {
      type: Number,
      default: 0,
    },
    da: {
      type: Number,
      default: 0,
    },
    otherAllowances: {
      type: Number,
      default: 0,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    overtime: {
      type: Number,
      default: 0,
    },
  },
  deductions: {
    pf: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    insurance: {
      type: Number,
      default: 0,
    },
    loanDeduction: {
      type: Number,
      default: 0,
    },
    lateDeduction: {
      type: Number,
      default: 0,
    },
  },
  grossSalary: {
    type: Number,
    required: true,
  },
  totalDeductions: {
    type: Number,
    required: true,
  },
  netSalary: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Processed', 'Paid'],
    default: 'Pending',
  },
  paymentDate: {
    type: Date,
  },
  remarks: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index to prevent duplicate payroll for same employee/month/year
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);
