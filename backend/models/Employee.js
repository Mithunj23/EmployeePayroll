const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeCode: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  department: {
    type: String,
    required: true,
    enum: ['IT', 'HR', 'Finance', 'Operations', 'Sales', 'Marketing']
  },
  designation: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true,
    default: Date.now
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
    default: 'Full-time'
  },
  salary: {
    basicSalary: {
      type: Number,
      required: true
    },
    hra: {
      type: Number,
      default: 0
    },
    da: {
      type: Number,
      default: 0
    },
    otherAllowances: {
      type: Number,
      default: 0
    }
  },
  deductions: {
    pf: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    insurance: {
      type: Number,
      default: 0
    }
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branch: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Terminated'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
